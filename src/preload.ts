import asar from 'asar'
import cp from 'child_process'
import { EventEmitter } from 'events'
import fs from 'fs'
import { createMD5 } from 'hash-wasm'
import { IHasher } from 'hash-wasm/dist/lib/WASMInterface'
import iconv from 'iconv-lite'
import path from 'path'
import rimraf from 'rimraf'

const base = utools.isDev() ? __dirname : __dirname + '.unpacked'

function unpack() {
  if (utools.isDev() || fs.existsSync(base)) return
  emitStateChange('初始化中...')
  asar.extractAll(__dirname, base)
}

function iconvDecode(str = '') {
  return iconv.decode(Buffer.from(str, 'binary'), 'cp936')
}

function search(keyword: string) {
  keyword = keyword.trim().replaceAll(`'`, `"`)
  let pathOption = ''
  let searchText = ''

  if (keyword.includes(`"`)) {
    const kws = keyword.split(`"`)
    pathOption = kws[1]
    searchText = (kws[2] || '').trim()
  } else {
    const kws = keyword.split(` `)
    pathOption = kws[0]
    searchText = (kws[1] || '').trim()
  }

  return new Promise<string[]>((ok, fail) => {
    let command = `${path.resolve(
      base,
      './es/es.exe'
    )} /a-d -path '${pathOption}'`

    if (searchText) {
      command += ` '${searchText}'`
    }

    console.log('执行命令：', command)

    cp.exec(
      command,
      {
        encoding: 'binary',
        maxBuffer: 1024 * 1024 * 1024,
        shell: 'powershell.exe',
      },
      (err, stdout, _) => {
        if (err) {
          err.message = iconvDecode(err.message)
          fail(err)
        } else {
          ok(iconvDecode(stdout).split('\r\n').filter(Boolean))
        }
      }
    )
  })
}

let hasher: IHasher | null = null

function fileMd5(filePath: string) {
  return new Promise<string>(async (ok, fail) => {
    try {
      const stateInfo = fs.statSync(filePath)
      const fileSize = stateInfo.size

      //文件每块分割10M，计算分割详情
      // chunkSize = 2097152,
      const chunkSize = 1024 * 1024 * 10
      const chunks = Math.ceil(fileSize / chunkSize)
      let currentChunk = 0

      if (hasher) {
        hasher.init()
      } else {
        hasher = await createMD5()
      }

      const fd = fs.openSync(filePath, 'r')
      var buf = Buffer.alloc(chunkSize)
      //处理单片文件的数据
      function loadNext() {
        var start = currentChunk * chunkSize
        var len = start + chunkSize >= fileSize ? fileSize - start : chunkSize

        fs.read(fd, buf, 0, len, start, (err, bytesRead, buffer) => {
          var chunk = Uint8Array.from(buffer.slice(0, bytesRead))
          hasher!.update(chunk)
          ++currentChunk
          if (start + bytesRead < fileSize) {
            // 循环读取
            loadNext()
          } else {
            fs.closeSync(fd)
            const hash = hasher!.digest()
            ok(hash)
          }
        })
      }

      //触发读取文件
      loadNext()
    } catch (err) {
      fail(err)
    }
  })
}

export async function start(keyword: string) {
  try {
    unpack()
    const startTime = Date.now()
    emitStateChange('正在检索文件...')
    const filePaths = await search(keyword)

    const repeatFileGroups = new Map<string, string[]>()
    let hashCache: string[] = []

    for (const filePath of filePaths) {
      emitStateChange(`正在计算 MD5: ${filePath}`)
      try {
        const hash = await fileMd5(filePath)
        let repeatFiles = repeatFileGroups.get(hash)
        if (!repeatFiles) {
          repeatFiles = []
          repeatFileGroups.set(hash, repeatFiles)
        }
        repeatFiles.push(filePath)

        if (hashCache.includes(hash)) {
          emitRefresh({
            hash,
            repeatFiles,
          })
        } else {
          hashCache.push(hash)
        }
      } catch (err) {
        console.log(`${filePath} MD5 计算失败`)
      }
    }

    let repeatFileCount = 0
    repeatFileGroups.forEach((value) => {
      if (value.length === 1) return
      repeatFileCount += value.length
    })
    emitStateChange(
      `查找完成 • ${filePaths.length}/${repeatFileCount} • 耗时 ${
        Date.now() - startTime
      }ms`
    )
  } catch (err: any) {
    console.log(err)
    emitStateChange(err.message)
  }
}

const nodeEvent = new EventEmitter()

export function onStateChange(cb: (text: string) => void) {
  nodeEvent.on('stateChange', cb)
}

function emitStateChange(text: string) {
  nodeEvent.emit('stateChange', text)
}

export function onRefresh(
  cb: (payload: { hash: string; repeatFiles: string[] }) => void
) {
  nodeEvent.on('refresh', cb)
}

function emitRefresh(payload: { hash: string; repeatFiles: string[] }) {
  nodeEvent.emit('refresh', payload)
}

export function rmf(filePath: string) {
  return new Promise<void>((ok, fail) => {
    rimraf(filePath, (err) => {
      if (err) {
        fail(err)
      } else {
        ok()
      }
    })
  })
}

