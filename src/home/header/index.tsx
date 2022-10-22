import { useStore } from '@libeilong/react-store-provider'
import { Button, Dropdown, Input, Menu } from 'antd'
import { Observer } from 'mobx-react-lite'
import { Store } from '../store'
import styles from './index.module.scss'

export const Header = () => {
  const store = useStore<Store>()

  const renderState = (
    <Observer>
      {() => <div className={styles.state}>{store.state}</div>}
    </Observer>
  )

  return (
    <div className={styles.index}>
      <Observer>
        {() => (
          <div className={styles.searchBox}>
            <Input
              disabled={store.loading}
              className={styles.input}
              placeholder="搜索"
              value={store.keyword}
              onChange={(e) => (store.keyword = e.target.value)}
            />
            <Button
              disabled={store.loading}
              className={styles.btn}
              type="primary"
              onClick={store.start}
            >
              开始查找
            </Button>
          </div>
        )}
      </Observer>
      <div className={styles.toolBar}>
        {renderState}
        <div>
          {/* <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    key: 'nameShort',
                    label: '保留名字最短',
                  },
                  {
                    key: 'pathShort',
                    label: '保留路径最短',
                  },
                  {
                    key: 'outer',
                    label: '保留最外层',
                  },
                ]}
              />
            }
          >
            快速选中
          </Dropdown> */}
        </div>
      </div>
    </div>
  )
}

