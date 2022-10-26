import { Button, Checkbox, Dropdown, Menu } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
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
  onDelete,
}) => {
  const menu = (
    <Menu>
      <Menu.Item onClick={() => onSelect('nameShort')}>保留名字短的</Menu.Item>
      <Menu.Item onClick={() => onSelect('pathShort')}>保留路径短的</Menu.Item>
      <Menu.Item onClick={() => onSelect('shallow')}>保留层级浅的</Menu.Item>
      <Menu.Item onClick={() => onSelect('minTime')}>保留最早创建的</Menu.Item>
      <Menu.Item onClick={() => onSelect('maxTime')}>保留最晚创建的</Menu.Item>
    </Menu>
  )

  return (
    <Observer>
      {() => (
        <div className={styles.index}>
          <div className={styles.header}>
            <div className={styles.md5}>MD5: {group.hash}</div>
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
                onClick={() => onDelete()}
              ></Button>
            </div>
          </div>
          <div className={styles.fileList}>
            {group.files.map((file, i) => {
              const filePathSplit = file.filePath.split('\\')
              const name = filePathSplit.pop()
              const ditPath = filePathSplit.join('\\')
              return (
                <div
                  style={
                    {
                      '--ant-primary-color': 'var(--ant-error-color)',
                    } as any
                  }
                  key={file.filePath}
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
                  <div className={styles.info}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.metas}>
                      <span>
                        <Icon className={styles.icon} value="time-line" />
                        {dayjs(file.stats.birthtime).format(
                          'YYYY-MM-DD hh:mm:ss'
                        )}
                      </span>
                      <span>
                        <Icon
                          className={styles.icon}
                          value="pie-chart-2-line"
                        />
                        {(file.stats.size / 1024).toFixed(0)}kb
                      </span>
                      <span className={styles.path}>{ditPath}</span>
                    </div>
                  </div>
                  {!file.deleted && (
                    <div className={styles.actions}>
                      <Button
                        type="text"
                        icon={<Icon value="eye-line" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          utools.shellOpenPath(file.filePath)
                        }}
                      ></Button>
                      <Button
                        type="text"
                        icon={<Icon value="folder-2-line" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          utools.shellShowItemInFolder(file.filePath)
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

