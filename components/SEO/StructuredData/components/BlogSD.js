import { ArticleJsonLd } from 'next-seo'
import moment from 'moment'
import { useRouter } from 'next/router'

const BlogSD = ({data}) => {

  const router = useRouter()

  if (!data.fields.seo) {
    return ''
  }

  const url = `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/${router.asPath}`
  const { metaTitle = '', metaDesc = '', shareGraphic = undefined } = data.fields.seo
  let datePublished = moment.unix(data.createdAt).format('MM/DD/YYYY')
  const dateModified = moment.unix(data.updatedAt).format('MM/DD/YYYY')

  if (data.fields.publishedDate) {
    datePublished = moment(data.fields.publishedDate).format('MM/DD/YYYY')
  }

  const images = []

  if (shareGraphic) {
    images.push(shareGraphic.asset.url)
  }

  return (
    <ArticleJsonLd
      type="Blog"
      url={url}
      title={metaTitle}
      images={images}
      datePublished={datePublished}
      dateModified={dateModified}
      description={metaDesc}
    />
  )
}

export default BlogSD