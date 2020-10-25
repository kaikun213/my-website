import React, { useEffect, useMemo, useState } from 'react';
import PageTransition from 'gatsby-plugin-page-transitions';
import { Helmet } from "react-helmet";
import { graphql, } from 'gatsby';
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

const dataToProjects = (data) => {
  const { allFile: { edges } } = data
  const { projects } = projectsData
  const edgeMap = arrToObj(edges, e => e.node.relativePath, e => e.node.publicURL)
  return projects
    .sort((p1,p2) => Date.parse(p2.date) - Date.parse(p1.date))
    .map(p => {
      return {
        ...p,
        image: edgeMap[`projects/${p.image}`],
        avatar: edgeMap[`projects/${p.avatar}`]
      }
    })
}

const Landing = ({ data }) => {
  const [projects, setProjects] = useState(dataToProjects(data))
  const [filter, setFilter] = useState(filters[0])
  const [project, setProject] = useState(projects.filter(p => p.categories.includes(filter.key))[0])
  const [showScrollDown, setShowScrollDown] = useState({ opacity: "1" })

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
    const updatedProjects = dataToProjects(data)
    setProjects(updatedProjects)
    setProject(updatedProjects.filter(p => p.categories.includes(filter.key))[0])
    return () => {
      firstTimeLoaded = false
    }
  }, [data])

  const preview = firstTimeLoaded

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.categories.includes(filter.key))
  }, [filter, filters, projects])
  

  return (
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
  )
}

export default Landing

export const query = graphql`
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
`