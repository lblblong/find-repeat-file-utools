import { Stats } from 'fs'

export interface IRepeatFileGroup {
  hash: string
  files: IRepeatFile[]
}

export interface IRepeatFile {
  filePath: string
  stats: Stats
  deleted: boolean
  selected: boolean
}

