import { useStore, withStore } from '@libeilong/react-store-provider'
import { Observer } from 'mobx-react-lite'
import { Footer } from './footer'
import { Header } from './header'
import styles from './index.module.scss'
import { List } from './list'
import { NotFound } from './notFound'
import { Store } from './store'
import { Welcome } from './welcome'

function _Home() {
  const store = useStore<Store>()

  return (
    <div className={styles.index}>
      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.main}>
        <Observer>
          {() => {
            if (store.loading) return <List />
            if (store.done) {
              if (store.repeatFileGroups.length === 0) {
                return <NotFound />
              } else {
                return <List />
              }
            } else {
              return <Welcome />
            }
          }}
        </Observer>
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}

export const Home = withStore(_Home, Store)

