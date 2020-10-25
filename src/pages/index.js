import React, { useEffect, useMemo, useState } from 'react';
import PageTransition from 'gatsby-plugin-page-transitions';
import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from 'gatsby';
import AnimatedHeadline from "../components/Animations/AnimatedHeadline";
import ProjectsList from "../components/PageComponents/ProjectsList";
import ProjectCard from "../components/PageComponents/ProjectCard";
import projectsData from '../data/projects/data.json'
import { arrToObj } from '../utils';

import './landing.scss'

let firstTimeLoaded = true

const filters = [
  { name: "Software Development", key: "SOFTWARE" },
  { name: "Data Science", key: "DATA" },
  { name: "Computational Biology", key: "BIO" },
]

const Landing = () => {
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(undefined)
  const [filter, setFilter] = useState(filters[0])
  const [showScrollDown, setShowScrollDown] = useState({ opacity: "1" })

  const { allFile: { edges } } = useStaticQuery(graphql`
    query {
      allFile(filter: { relativeDirectory: { eq: "projects" }}) {
        edges {
          node {
            relativePath
            publicURL
          }
        }
      }
    }
  `)

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onscroll = () => {
        const currentScrollPos = window.pageYOffset;
        if (currentScrollPos > 250) {
          setShowScrollDown({ opacity: "0" })
        } else {
          setShowScrollDown({ opacity: "1" })
        }
      }
    }
  }, [])

  useEffect(() => {
    const { projects } = projectsData
    const edgeMap = arrToObj(edges, e => e.node.relativePath, e => e.node.publicURL)
    projects.forEach(p => {
      p.image = edgeMap[`projects/${p.image}`]
      p.avatar = edgeMap[`projects/${p.avatar}`]
    })
    projects.sort((p1,p2) => Date.parse(p2.date) - Date.parse(p1.date))
    setProjects(projects)
    setProject(projects[0])
    return () => {
      firstTimeLoaded = false
    }
  }, [edges])

  const preview = firstTimeLoaded

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.categories.includes(filter.key))
  }, [filter, filters, projects])
  

  return (
    <PageTransition
      defaultStyle={{
        transition: 'right 500ms cubic-bezier(0.47, 0, 0.75, 0.72)',
        right: '100%',
        position: 'relative',
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
              headers={filters}
              subtext="For the sake of learning"
              hidePreview={!preview}
              filter={filter}
              onSelect={f => setFilter(f)}
          />
        </section>
        <div 
          className="mouse" 
          style={showScrollDown}
        >
          <div className="scroll"></div>
        </div>

        <div className="projects">
          <ProjectsList projects={filteredProjects} filter={filter} onSelect={p => setProject(p)} />
          <ProjectCard project={project} />
        </div>
      </div>
    </PageTransition>
  )
}

export default Landing