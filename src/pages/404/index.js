import React from 'react'
import { Helmet } from 'react-helmet'
import { navigate } from 'gatsby'
import { Button } from '@material-ui/core'

import './style.scss'

const NotFoundPage = () => {
  return (
      <div className="not-found-page">
        <Helmet title="Not Found" />
        <div className="not-found-container">
          <div className="not-found-wrapper">
            <h1 className="font-p">
              Page not found
            </h1>
            <p className="mb-3">
              The page is deprecated, deleted, or does not exist at all.
            </p>
            <h1 className="font-404">404 —</h1>
            <div className="btn-container">
              <Button 
                variant="outlined" 
                onClick={() => navigate("/")}
                className="btn"
              >
                Go back to the home page
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default NotFoundPage
