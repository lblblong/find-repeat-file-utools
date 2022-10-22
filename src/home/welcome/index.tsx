import { Button, Divider } from 'antd'
import welcomeImage from '../../assets/images/undraw_welcome_cats_thqn.png'
import { Icon } from '../../components/icon'
import { openWechatPay } from '../../components/popups/wechatPay'
import styles from './index.module.scss'

export const Welcome = () => {
  return (
    <div className={styles.index}>
      <img src={welcomeImage} alt="" />
      <div className={styles.des}>
        如果该应用帮助到你，欢迎赞助，这将是我持续更新的动力。
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.btn}
          type="primary"
          onClick={() => {
            openWechatPay()
          }}
        >
          <div className={styles.btnInner}>
            <Icon value="money-cny-circle-fill" />
            赞助作者
          </div>
        </Button>
        <Button
          className={styles.btn}
          onClick={() => {
            utools.shellOpenExternal(
              'https://github.com/lblblong/find-repeat-file-utools'
            )
          }}
        >
          <div className={styles.btnInner}>
            <Icon value="github-fill" />
            GitHub
          </div>
        </Button>
      </div>

      <Divider />

      <h2>搜索示例</h2>
      <div className={styles.exmple}>
        <div>
          搜索 <span>D:\图片</span> 目录下的重复文件：<span>D:\图片</span>
        </div>
        <div>
          搜索 <span>D:\图片</span> 目录下的重复文件，但只搜索 .png 格式：
          <span>D:\图片 .png</span>
        </div>
        <div>
          搜索 <span>D:\图片</span> 目录下的重复文件，但只搜索 .png 和 .jpg
          格式：<span>D:\图片 .png|.jpg</span>
        </div>
        <div>
          如果文件夹包含空格，需要使用引号包裹：
          <span>"D:\图片 - 副本" .png|.jpg</span>
        </div>
      </div>

      <h2>Everything</h2>
      <div>
        本插件需要安装 Everything 才可使用，如未安装请先安装：
        <a
          href="#"
          onClick={() =>
            utools.shellOpenExternal(
              'https://www.voidtools.com/zh-cn/downloads/'
            )
          }
        >
          https://www.voidtools.com/zh-cn/downloads/
        </a>
      </div>

      <div>
        <Button
          type="link"
          onClick={() => {
            utools.shellOpenExternal(
              'https://docs.qq.com/sheet/DVUNpcm9QWWFGdXpl?tab=BB08J2'
            )
          }}
        >
          <div className={styles.btnInner}>
            <Icon value="question-line" />
            问题反馈
          </div>
        </Button>
      </div>
    </div>
  )
}

