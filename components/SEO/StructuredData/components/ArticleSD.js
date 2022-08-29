import { ArticleJsonLd } from 'next-seo'
import moment from 'moment'
import { useRouter } from 'next/router'

const ArticleSD = ({data}) => {

  const router = useRouter()

  if (!data.fields.seo) {
    return ''
  }

  const url = `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/${router.asPath}`
  const { metaTitle = '', metaDesc = '', shareGraphic = undefined } = data.fields.seo
  const content = data.fields?.content
  const author = data.fields?.sidebar?.author
  const hosts = data.fields?.sidebar?.hosts
  let datePublished = moment.unix(data.createdAt).format('MM/DD/YYYY')
  const dateModified = moment.unix(data.updatedAt).format('MM/DD/YYYY')
  const images = []

  if (data.fields?.publishedDate) {
    datePublished = moment(data.fields.publishedDate).format('MM/DD/YYYY')
  }

  if (shareGraphic) {
    images.push(shareGraphic.asset.url)
  }

  if (data.fields?.hero?.desktopBackgroundImage) {
    images.push(data.fields.hero.desktopBackgroundImage.asset.url)
  }

  if (content) {
    content.forEach(item => {
      if (item._type === 'image' && item.asset?.url) {
        const image = item.asset.url
        images.push(image)
      }
    })
  }

  let authors = []

  if (hosts) {
    authors = hosts.hostList.map(host => host.name)
  } else if (author) {
    authors = [author.name]
  }

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