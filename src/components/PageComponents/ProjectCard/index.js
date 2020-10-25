import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { GitHub, Home } from '@material-ui/icons';
import { AttentionSeeker, } from 'react-awesome-reveal';
import { Tag, TagGroup } from 'rsuite';
import "rsuite/dist/styles/rsuite-default.min.css"

import './style.scss'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: "auto",
    boxShadow: "3px 10px 20px 0 rgba(0,0,0,0.3);",
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const ProjectCard = (props) => {
  const { project={} } = props
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const { avatar, image, title, description, text, textDate, github, website, tags=[] } = project

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // NOTE: The key={title} causes react to destroy the component on project changes and render a new one
  //       Thus the animation will be re-triggered. However, it causes an unnessesary large render in DOM.
  return (
    <AttentionSeeker effect="pulse" className="project-card" /*key={title}*/>
      <Card className={classes.root}>
        <CardHeader
          avatar={avatar && (
            <Avatar 
              aria-label="avatar" 
              className={classes.avatar} 
              src={avatar} 
            />
          )}
          title={title}
          subheader={textDate}
        />
        <CardMedia
          className={classes.media}
          image={image}
          title={title}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {github && (
            <IconButton aria-label="github" onClick={() => window.open(github)} className="github-icon">
              <GitHub />
            </IconButton>
          )}
          {website && (
            <IconButton aria-label="website" onClick={() => window.open(website)} className="home-icon">
              <Home />
            </IconButton>
          )}
          <TagGroup className="tags">
            {tags.map(t => (
              <Tag key={t}>
                {t}
              </Tag>
            ))}
          </TagGroup>
          {text && (
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </CardActions>
        {text && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Details:</Typography>
              <Typography paragraph>
                {text}
              </Typography>
            </CardContent>
          </Collapse>
        )}
      </Card>
    </AttentionSeeker>
  );
}

export default ProjectCard
