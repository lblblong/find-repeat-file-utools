export interface IRepeatFileGroup {
  hash: string
  files: IRepeatFile[]
}

export interface IRepeatFile {
  path: string
  deleted: boolean
  selected: boolean
}

