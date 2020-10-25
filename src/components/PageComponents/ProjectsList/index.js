import React from 'react'
import { Fade, } from 'react-awesome-reveal';
import './style.scss'

const ProjectsList = (props) => {
  const { projects=[], filter, onSelect } = props

  // number of rows and minimum number of columns, you can adjust as you please
  const n_rows = 3; // at least 1 !!!
  const n_cols_min = projects.length >= 8 ? 3 : 2; // at least 1 !!!
  const n_cols_max = n_cols_min + 1, n_cols_sum = n_cols_max + n_cols_min;

  const imgs = projects.map(p => p.avatar)
  // let imgs = [
  //      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=650&fm=jpg', 
  //      'https://images.unsplash.com/photo-1497733942558-e74c87ef89db?w=650&fm=jpg', 
  //      'https://images.unsplash.com/photo-1540744276164-9dc898353c7b?w=650&fm=jpg', 
  //      'https://images.unsplash.com/photo-1469975692758-66d107a536cb?w=650&fm=jpg', 
  //      'https://images.unsplash.com/photo-1490845060161-85f9ce08a9f4?w=650&fm=jpg', 
  //      'https://images.unsplash.com/photo-1541673504494-8bcc1a340180?w=650&fm=jpg', 
  //      'https://images.unsplash.com/photo-1515937350506-3e7b51a95339?w=650&fm=jpg'
  // ];

  return (
    <div
      className="projects-list-wrapper"
    >
      {/* NOTE: The key={filter.key} causes react to destroy the component on project changes and render a new one */}
      {/*       Thus the animation will be re-triggered. However, it causes an unnessesary large render in DOM. */}
      <Fade /*key={filter.key}*/>
        <div 
          className="projects-list"
          style={{ 
            "--n-rows": n_rows, 
            "--n-cols": 2*n_cols_max, 
          }}
        >
          {imgs.map((i, idx) => (
            <div 
              key={i}
              className="hex-cell"
              style={idx%n_cols_sum === 0 ? { "gridColumnStart": 2 } : {}}
              onClick={() => onSelect(projects[idx])}
            >
              <img src={i} alt={i} />
            </div>
          ))}
        </div>
      </Fade>
    </div>
  )
}


export default ProjectsList