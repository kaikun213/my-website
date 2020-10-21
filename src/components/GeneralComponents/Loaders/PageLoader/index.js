import React from 'react'
import classNames from 'classnames'
import styles from './style.module.scss'

const PageLoader = ({ spinning = true, fullScreen, text }) => (
  <>
    <div
      className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
    />
    <div className={styles.text}>{text}</div>
  </>
)

export default PageLoader
