import React from 'react'
import Youtube from 'react-youtube'

const Video = ({youtubeVideoId, startVideo, autoplay = true, className}) => {

  const onReady = (event) => {
    if (!autoplay) {
      return false
    }
    setTimeout(() => {
      event.target.playVideo();
    }, 1000)
  }

  const youtubeOptions = {
    height: '390',
    width: '640',
    playerVars: {
      controls: 0,
      // https://developers.google.com/youtube/player_parameters
      rel: 0
    },
  }

  if (!startVideo) {
    return ''
  }

  return (
    <div className={className}>
      <Youtube videoId={youtubeVideoId} opts={youtubeOptions} onReady={(e) => onReady(e)} />
    </div>
  )
}

export default Video