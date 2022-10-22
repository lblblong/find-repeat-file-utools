import 'antd/dist/antd.variable.min.css'
import { configure } from 'mobx'
import { ManagerProvider } from 'oh-popup-react'
import 'oh-popup-react/dist/style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Home } from './home'
import { popupManager } from './shared/popupManager'

configure({ enforceActions: 'never' })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ManagerProvider manager={popupManager} />
    <Home />
  </React.StrictMode>
)

