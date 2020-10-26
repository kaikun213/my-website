import React from 'react'
import { Avatar, } from "rsuite";
import { graphql, Link, useStaticQuery, } from "gatsby";
import LogoLoader from '../../GeneralComponents/Loaders/LogoLoader';
import './style.scss'

const Header = () => {

  const { file } = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "avatar.png" }) {
        name
        absolutePath
        relativePath
        publicURL
      }
    }
  `)

  return (
    <header className="box-header">
        <div className="box-logo">
          <Link to="/">
            <LogoLoader width={80} height={80} />
          </Link>
        </div>
        <div className="box-about-me">
          <Link to="/about/">
            <Avatar alt="About me" src={file.publicURL} circle />
          </Link>
        </div>
    </header>
  )
}

export default Header