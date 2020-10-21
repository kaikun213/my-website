import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styles from './style.module.scss'
import init, { randomizePixels } from './webgl'

const LogoLoader = ({ width = 500, height = 500, className, onClick }) => {
  const [initialized, setInitialized] = useState(false)
  const canvas = React.createRef()
  const image = React.createRef()

  const { file } = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo-animation-32px.jpg" }) {
        name
        absolutePath
        relativePath
        publicURL
      }
    }
  `)

  useEffect(() => {
    if (image.current && canvas.current && !initialized) {
      init(image.current, canvas.current, file.publicURL)
      setInitialized(true)
    }
  }, [image, canvas, initialized])

  const handleClick = () => {
    randomizePixels()
    if (onClick) onClick()
  }

  return (
    <div className={className} onClick={handleClick}>
      <canvas ref={image} className={styles.none} />
      <canvas ref={canvas} id="c" className={styles.animatedLogo} width={width} height={height} />
    </div>
  )
}

export default LogoLoader
