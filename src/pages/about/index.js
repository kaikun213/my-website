import React from 'react'
import PageTransition from 'gatsby-plugin-page-transitions'
import Img from "gatsby-image"
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import DescriptionIcon from '@material-ui/icons/Description';
import { graphql } from 'gatsby'
import { Tooltip } from '@material-ui/core';
import { Helmet } from 'react-helmet';

import './style.scss'


const About = ({ data }) => {

  const openResumeTab = () => {
    window.open(data.resumePdf.publicURL,'resizable,scrollbars');
    return false;
  }

  return (
    <PageTransition
      defaultStyle={{
        transition: 'left 500ms cubic-bezier(0.47, 0, 0.75, 0.72)',
        left: '100%',
        position: 'relative',
        width: '100%',
      }}
      transitionStyles={{
        entering: { left: '0%' },
        entered: { left: '0%' },
        exiting: { left: '100%' },
      }}
    >
      <div className="about">
        <Helmet title="About Me" />
        <div className="content">
          <div className="profile-img">
            <Img fluid={data.profileImg.childImageSharp.fluid} />
          </div>
          <div className="profile-text">
            <b>Jakob Heyder: </b> 
            I am a software engineer, data scientist and enterpreneur. My interests are in artificial intelligence, automation and life science. 
            
            <br /><br />
            <i>What am I up to?</i>

            <ul>
              <li>
                In 2018 I have co-founded <a href="https://ventury-analytics.de">Ventury Analytics</a>, one of the leading SaaS platforms in Germany. We help founders and venture capitalists with Captable-Management, Scenario Modelling and Exit calculations.
              </li>
              <li>
                In summer 2020 I graduated from the <a href="https://www.kth.se/scs/data-science-and-applied-ai/">data science program</a> at Sweden’s top technical university KTH. Before I obtained my bachelor in software engineering at LNU and HKUST.
              </li>
              <li>
                During my studies I have worked on multiple versions of <a href="https://github.com/kaikun213/My_Neural_Net">HTM-based systems</a>. Neuroscience based approaches to neural network architectures fascinate me and I regularly try to read up on current trends.
              </li>
            </ul>
            
            This webpage showcases some of my past projects and I will share learnings about new interesting topics.
          </div>
          <div className="profile-contact">
            <a href="https://github.com/kaikun213" target="_blank" rel="noopener noreferrer">
              <GitHubIcon color="action" fontSize="large" className="github" />
            </a>
            <a href="https://www.linkedin.com/in/jakob-heyder-50882413a/" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon color="action" fontSize="large" className="linkedin" />
            </a>
            <Tooltip title="Resume">
              <DescriptionIcon 
                color="action" 
                fontSize="large" 
                className="resume" 
                onClick={openResumeTab}
              />
            </Tooltip>
          </div>
        </div>
                
      </div>
    </PageTransition>
  )
}

export default About

export const query = graphql`
  query {
    profileImg: file(relativePath: { eq: "profile.jpg" }) {
      childImageSharp {
        fluid(maxHeight: 700, quality: 100) {
          ...GatsbyImageSharpFluid
          ...GatsbyImageSharpFluidLimitPresentationSize
        }
      }
    }

    resumePdf: file(relativePath: { eq: "resume.pdf" }) {
      name
      absolutePath
      relativePath
      publicURL
    }
  }
`