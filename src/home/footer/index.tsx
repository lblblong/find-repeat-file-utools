import { useStore } from '@libeilong/react-store-provider'
import { Button, Dropdown, Menu } from 'antd'
import { Observer } from 'mobx-react-lite'
import { Icon } from '../../components/icon'
import { Store } from '../store'
import styles from './index.module.scss'

export const Footer = () => {
  const store = useStore<Store>()

  const menu = (
    <Menu>
      <Menu.Item onClick={() => store.select('nameShort')}>
        保留名字短的
      </Menu.Item>
      <Menu.Item onClick={() => store.select('pathShort')}>
        保留路径短的
      </Menu.Item>
      <Menu.Item onClick={() => store.select('outer')}>保留最外层的</Menu.Item>
    </Menu>
  )

  return (
    <div className={styles.index}>
      <Observer>
        {() => {
          return <div>已选中 <span className={styles.num}>{store.selectedCount}</span> 个文件（数据无价，请谨慎操作）</div>
        }}
      </Observer>
      <Observer>
        {() => (
          <div className={styles.actions}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                type="text"
                icon={<Icon value="checkbox-multiple-line" />}
              ></Button>
            </Dropdown>
            <Button
              disabled={store.selectedCount <= 0}
              danger
              type="primary"
              onClick={() => store.delete()}
            >
              删除所选文件
            </Button>
          </div>
        )}
      </Observer>
    </div>
  )
}

