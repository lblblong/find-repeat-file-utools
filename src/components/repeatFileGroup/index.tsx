import { Button, Checkbox, Dropdown, Menu } from 'antd'
import clsx from 'clsx'
import { Observer } from 'mobx-react-lite'
import { FC } from 'react'
import { IRepeatFile, IRepeatFileGroup } from '../../interface'
import { Icon } from '../icon'
import styles from './index.module.scss'

interface RepeatFileGroupProps {
  group: IRepeatFileGroup
  onSelect: (keep: string) => void
  onDeleteItem: (index: number, file: IRepeatFile) => void
  onDelete: () => void
}

export const RepeatFileGroup: FC<RepeatFileGroupProps> = ({
  group,
  onSelect,
  onDeleteItem,
  onDelete
}) => {
  const menu = (
    <Menu>
      <Menu.Item onClick={() => onSelect('nameShort')}>保留名字短的</Menu.Item>
      <Menu.Item onClick={() => onSelect('pathShort')}>保留路径短的</Menu.Item>
      <Menu.Item onClick={() => onSelect('outer')}>保留最外层的</Menu.Item>
    </Menu>
  )

  return (
    <Observer>
      {() => (
        <div className={styles.index}>
          <div className={styles.header}>
            <div>{group.hash}</div>
            <div className={styles.actions}>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button
                  type="text"
                  icon={<Icon value="checkbox-multiple-line" />}
                ></Button>
              </Dropdown>
              <Button
                type="text"
                danger
                icon={<Icon value="delete-bin-line" />}
                onClick={()=>onDelete()}
              ></Button>
            </div>
          </div>
          <div className={styles.fileList}>
            {group.files.map((file, i) => {
              return (
                <div
                  style={
                    {
                      '--ant-primary-color': 'var(--ant-error-color)',
                    } as any
                  }
                  key={file.path}
                  className={clsx(
                    styles.item,
                    file.selected && styles.selected,
                    file.deleted && styles.deleted
                  )}
                  onClick={() => {
                    if (file.deleted) return
                    file.selected = !file.selected
                  }}
                >
                  <Checkbox
                    disabled={file.deleted}
                    checked={file.selected}
                    onChange={(e) => (file.selected = e.target.checked)}
                  ></Checkbox>
                  <div className={styles.fileName}>{file.path}</div>
                  {!file.deleted && (
                    <div className={styles.actions}>
                      <Button
                        type="text"
                        icon={<Icon value="eye-line" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          utools.shellOpenPath(file.path)
                        }}
                      ></Button>
                      <Button
                        type="text"
                        icon={<Icon value="folder-2-line" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          utools.shellShowItemInFolder(file.path)
                        }}
                      ></Button>
                      <Button
                        type="text"
                        danger
                        icon={<Icon value="delete-bin-line" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteItem(i, file)
                        }}
                      ></Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Observer>
  )
}

