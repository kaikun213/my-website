import React from 'react'
import { graphql } from 'gatsby'
import Landing from './landing'

const IndexPage = ({ data }) => {
  return (
    <Landing data={data} />
  )
}

export default IndexPage

export const query = graphql`
  query {
    allFile(filter: { relativeDirectory: { eq: "projects" }}) {
      edges {
        node {
          relativePath
          publicURL
          childImageSharp {
            fixed {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`