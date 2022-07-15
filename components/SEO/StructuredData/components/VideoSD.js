import { VideoJsonLd } from 'next-seo';

const VideoSD = ({data}) => {

  const hasVideo = data.fields.hero?.youtubeVideoId

  if (!hasVideo || !data.fields.structuredData) {
    return ''
  }

  const { name = '', description = '' } = data.fields.structuredData
  const images = []

  if (data.fields.hero?.desktopBackgroundImage) {
    images.push(data.fields.hero.desktopBackgroundImage.asset.url)
  }

  return (
    <VideoJsonLd
      name={name}
      description={description}
      contentUrl={`https://www.youtube.com/watch?v=${data.fields.hero.youtubeVideoId}`}
      embedUrl={`https://www.youtube.com/embed/${data.fields.hero.youtubeVideoId}`}
      thumbnailUrls={images}
    />
  );
};

export default VideoSD;