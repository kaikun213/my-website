import React from 'react'
import Footer from '../Footer'
import Header from '../Header'
import './style.scss'


const Layout = ({ children }) => {

  return (
    <div className="layout-wrapper">
      <div className="header">
        <Header />
      </div>
      <div className="main">
        {children}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default Layout