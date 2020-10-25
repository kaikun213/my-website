import React, { useState } from 'react'
import ClassNames from 'classnames'
import { useInterval } from '../../../utils/hooks'
import Reveal, { AttentionSeeker, Fade, Slide, } from "react-awesome-reveal";
import { keyframes } from "@emotion/core";
import './style.scss'
import { GridList, GridListTile } from '@material-ui/core';
import { Affix } from 'rsuite';

const INITIAL_DELAY = 1000
const LETTERS_DELAY = 120
const ANIMATION_DELAY = 1500

const AnimatedHeadline = (props) => {
  const { phrases=[], hidePreview=false, headers, subtext, filter, onSelect } = props
  const [animationDelay, setAnimationDelay] = useState(INITIAL_DELAY)
  const [currentLetter, setCurrentLetter] = useState(-1)
  const [currentPhrase, setCurrentPhase] = useState(0)
  const [typeFinished, setTypeFinished] = useState(hidePreview)

  const tick = () => {
    const currentPhraseLength = phrases[currentPhrase].name.length
    const isLastLetter = currentLetter === currentPhraseLength-1
    const isPenultimateLetter = currentLetter === currentPhraseLength-2
    const isLastPhrase = currentPhrase === phrases.length-1 && isLastLetter
    
    // if we are on the last letter of the current phrase, we need
    // to increment the current phrase at the next pass [0]
    // unless it's the last phrase
    // in which case we reset the current phrase and letter [1]
    // if we are in the middle of a word, continue to increment 
    // only the current letter [2]
    if (isLastPhrase) {
      // setCurrentPhase(0)
      // setCurrentLetter(0)
      // setAnimationDelay(LETTERS_DELAY)      
      setAnimationDelay(Number.MAX_SAFE_INTEGER)
      setTypeFinished(true)
    } else if (isLastLetter) {
      setCurrentPhase(currentPhrase+1)
      setCurrentLetter(0)
      setAnimationDelay(LETTERS_DELAY)
    } else {
        if (isPenultimateLetter) {
          setCurrentLetter(currentLetter+1)
          setAnimationDelay(ANIMATION_DELAY)
        } else {
          setCurrentLetter(currentLetter+1)
          setAnimationDelay(LETTERS_DELAY)
        }
    }
  }

  const singleLetters = (phrase) => {
    const letters = phrase.split("");
    const newLetters = letters.map(function (letter, index) {
        return <i className={ currentLetter >= index ? 'in' : 'out' } key={index}>{letter}</i>
    });
    
    return newLetters;
  }

  const buildPhrase = (phrase, index) => {
    const isVisible = currentPhrase === index ? true : false;
    const classes = ClassNames({
        'is-visible': isVisible,
        'is-hidden': !isVisible
    });
    
    if ( phrase.hasOwnProperty('name') ) {   
        const text = phrase.name;
        if (isVisible) {
            // cycle through letters and create an <i> per letter
            // with class depending on matching the current letter
            const splitPhrase = singleLetters(text);
            if (phrase.hasOwnProperty('url') && phrase.hasOwnProperty('id')) {
                return <a className={ classes } key={index} href={phrase.url}>{ splitPhrase }</a>
            } else {
                return <b className={ classes } key={index}>{ splitPhrase }</b>
            }
        }
    }
  }

  useInterval(tick, typeFinished ? null : animationDelay)

  const renderedPhrases = phrases.map((phrase, index) => {
      return buildPhrase(phrase, index);
  });

  const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

  const animatedPhrases = typeFinished ? (
    <Affix top={50}>
      <Slide triggerOnce fraction={0.5}>
        <AttentionSeeker effect="headShake" delay={1000}>
          <GridList cellHeight={120} className="landing-headers" cols={headers.length}>
            {headers.map((header) => (
              <GridListTile key={header.key} cols={1}>
                <span 
                  onClick={() => onSelect(header)}
                  className={filter.key === header.key ? 'selected' : ''}
                >
                  {header.name}
                </span>
              </GridListTile>
            ))}
          </GridList>
        </AttentionSeeker>
      </Slide>
    </Affix>
  ) : (
    <h1 className="cd-headline letters type">
      <span className="cd-words-wrapper waiting">
          { renderedPhrases }
      </span>
    </h1>
  )

  return (
    <div className="table-cell">
      {animatedPhrases}
      {!hidePreview && (
        <Fade triggerOnce>
          <Reveal keyframes={fadeOutAnimation} delay={9000}>
            <h5>{subtext}</h5>
          </Reveal>
        </Fade>
      )}
    </div>
  )
}

export default AnimatedHeadline