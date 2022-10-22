import notFoundImage from '../../assets/images/undraw_my_files_swob.png'
import styles from './index.module.scss'

export const NotFound = () => {
  return (
    <div className={styles.index}>
      <img src={notFoundImage} alt="" />
      <div className={styles.des}>没有找到相关的重复文件</div>
    </div>
  )
}

