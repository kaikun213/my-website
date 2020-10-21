/* eslint-disable react/self-closing-comp */
import React from 'react'

import './style.scss'

const DotLoader = () => {
  return (
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default DotLoader
