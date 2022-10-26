import { makeAutoObservable } from 'mobx'
import { IRepeatFile, IRepeatFileGroup } from '../interface'
import { onRefresh, onStateChange, rmf, start } from '../preload'

export class Store {
  constructor() {
    makeAutoObservable(this)

    utools.onPluginEnter(async () => {
      let path = await utools.readCurrentFolderPath()
      if (path.includes(' ')) {
        path = `"${path}"`
      }
      this.keyword = path
    })

    onStateChange((state) => {
      this.state = state
    })

    onRefresh((preload) => {
      let group = this.repeatFileGroups.find((g) => g.hash === preload.hash)

      const files = preload.repeatFiles.map(({ filePath, stats }) => ({
        filePath,
        stats,
        deleted: false,
        selected: false,
      }))

      if (!group) {
        group = {
          hash: preload.hash,
          files,
        }
        this.repeatFileGroups.push(group)
      } else {
        group.files = files
      }
    })
  }

  state = ''

  keyword = ''

  repeatFileGroups: IRepeatFileGroup[] = []

  get selectedCount() {
    return this.repeatFileGroups.reduce((pre, cur) => {
      for (const file of cur.files) {
        if (file.selected && !file.deleted) pre++
      }
      return pre
    }, 0)
  }

  loading = false
  done = false

  start = async () => {
    if (this.loading || this.keyword.trim() === '') return
    try {
      this.loading = true
      this.done = false
      this.repeatFileGroups = []
      await start(this.keyword)
      console.log('执行完成')
    } catch (err) {
      console.log(err)
    } finally {
      this.loading = false
      this.done = true
    }
  }

  select = (
    keep: 'shallow' | 'nameShort' | 'pathShort' | 'minTime' | 'maxTime',
    hash?: string
  ) => {
    let groups: IRepeatFileGroup[] = hash
      ? [this.repeatFileGroups.find((g) => g.hash === hash)!]
      : this.repeatFileGroups

    const _select = (files: IRepeatFile[]) => {
      files[0].selected = false
      for (const file of files.slice(1)) {
        file.selected = true
      }
    }

    for (const group of groups) {
      const files = [...group.files].filter((file) => file.deleted === false)
      for (const file of files) {
        file.selected = false
      }

      switch (keep) {
        case 'shallow':
          _select(
            files.sort((a, b) => {
              return (
                a.filePath.split('\\').length - b.filePath.split('\\').length
              )
            })
          )
          break
        case 'nameShort':
          _select(
            files.sort((a, b) => {
              return (
                a.filePath.split('\\').pop()!.length -
                b.filePath.split('\\').pop()!.length
              )
            })
          )
          break
        case 'pathShort':
          _select(
            files.sort((a, b) => {
              return a.filePath.length - b.filePath.length
            })
          )
          break
        case 'minTime':
          _select(
            files.sort((a, b) => {
              return +a.stats.birthtime - +b.stats.birthtime
            })
          )
          break
        case 'maxTime':
          _select(
            files.sort((a, b) => {
              return +b.stats.birthtime - +a.stats.birthtime
            })
          )
          break
      }
    }
  }

  delete = (hash?: string) => {
    let groups: IRepeatFileGroup[] = hash
      ? [this.repeatFileGroups.find((g) => g.hash === hash)!]
      : this.repeatFileGroups

    for (const group of groups) {
      for (const file of group.files) {
        if (file.deleted || !file.selected) continue
        rmf(file.filePath)
        file.deleted = true
      }
    }
  }
}

