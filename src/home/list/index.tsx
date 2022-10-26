import { useStore } from '@libeilong/react-store-provider'
import { Observer } from 'mobx-react-lite'
import { RepeatFileGroup } from '../../components/repeatFileGroup'
import { rmf } from '../../preload'
import { Store } from '../store'
import styles from './index.module.scss'

export const List = () => {
  const store = useStore<Store>()
  return (
    <Observer>
      {() => (
        <div className={styles.index}>
          {store.repeatFileGroups.map((group) => {
            return (
              <div key={group.hash} className={styles.group}>
                <RepeatFileGroup
                  group={group}
                  onSelect={(keep) => {
                    store.select(keep as any, group.hash)
                  }}
                  onDeleteItem={(i) => {
                    rmf(group.files[i].filePath)
                    group.files[i].deleted = true
                  }}
                  onDelete={() => {
                    store.delete(group.hash)
                  }}
                />
              </div>
            )
          })}
        </div>
      )}
    </Observer>
  )
}

