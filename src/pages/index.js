import React from "react"
import PageTransition from 'gatsby-plugin-page-transitions';
import { Helmet } from "react-helmet";
import AnimatedHeadline from "../components/Animations/AnimatedHeadline";
import './landing.scss'

let firstTimeLoaded = true

const Landing = () => {
  const preview = firstTimeLoaded
  firstTimeLoaded = false

  return (
    <PageTransition
      defaultStyle={{
        transition: 'right 500ms cubic-bezier(0.47, 0, 0.75, 0.72)',
        right: '100%',
        position: 'absolute',
        width: '100%',
      }}
      transitionStyles={{
        entering: { right: '0%' },
        entered: { right: '0%' },
        exiting: { right: '100%' },
      }}
    >
      <div className="landing">
        <Helmet title="Homepage" />
        <section className="box-intro">
            <AnimatedHeadline
                phrases={
                    [
                      { name: "Data.", },
                      { name: "Code.", },
                      { name: "Bio.", },

                    ]
                }
                headers={
                  [
                    "Software Development",
                    "Data Science",
                    "Computational Biology",
                  ]
                }
                subtext="For the sake of learning"
                hidePreview={!preview}
            />

            <div className="mouse">
                <div className="scroll"></div>
            </div>
        </section>

        <div>
          Main
        </div>

        <a href="#0" className="cd-top">
            <ion-icon name="arrow-up"></ion-icon>
        </a>
      </div>
    </PageTransition>
  )
}

export default Landing