import { Button } from 'antd'
import { useController } from 'oh-popup-react'
import wechatPayImage from '../../../assets/images/wechat-pay.png'
import { popupManager } from '../../../shared/popupManager'

const Widget = () => {
  const ctl = useController()

  return (
    <div
      style={{
        background: '#fff',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 8,
      }}
    >
      <img style={{ width: 240 }} src={wechatPayImage} />
      <Button
        style={{ marginTop: 8 }}
        shape="round"
        onClick={() => ctl.close()}
      >
        关闭
      </Button>
    </div>
  )
}

export function openWechatPay() {
  return popupManager.open({
    el: <Widget />,
    position: 'center',
  })
}

