import { ArticleJsonLd } from 'next-seo'
import moment from 'moment'
import { useRouter } from 'next/router'

const ArticleSD = ({data}) => {

  const router = useRouter()

  if (!data.fields.seo) {
    return ''
  }

  const url = `https://${process.env.NEXT_PUBLIC_MYSHOPIFY_DOMAIN}/${router.asPath}`
  const { metaTitle = '', metaDesc = '', shareGraphic = undefined } = data.fields.seo
  const content = data.fields.content
  const { author = '', hosts = '' } = data.fields.sidebar
  const datePublished = moment.unix(data.createdAt).format('MM/DD/YYYY')
  const dateModified = moment.unix(data.updatedAt).format('MM/DD/YYYY')
  const images = []

  if (shareGraphic) {
    images.push(shareGraphic.asset.url)
  }

  if (data.fields.hero?.desktopBackgroundImage) {
    images.push(data.fields.hero.desktopBackgroundImage.asset.url)
  }

  if (content) {
    content.forEach(item => {
      if (item._type === 'image') {
        const image = item.asset.url
        images.push(image)
      }
    })
  }

  const authors = hosts ? hosts.hostList.map(host => host.name) : [author.name]

  return (
    <ArticleJsonLd
      url={url}
      title={metaTitle}
      images={images}
      datePublished={datePublished}
      dateModified={dateModified}
      authorName={authors}
      description={metaDesc}
    />
  )
}

export default ArticleSD