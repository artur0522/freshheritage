import ArticleContestForm from '@/components/Article/ArticleContestForm'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import ContentSections from '@/components/Sections/ContentSections'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'

const CulinaryContestArticle = ({ page, product, blogSettings }) => {

  const blogGlobalSettings = blogSettings ? blogSettings.fields['culinary'] : undefined

  return (
    <div className="article-culinary-contest">
      <StructuredData type="article" data={page} />
      <PageSEO seo={page.fields.seo} />
      <div className="container">
        <ArticleContestForm fields={page} />
      </div>
      <ArticleMain contentType="standard" fields={page.fields} product={product} blogGlobalSettings={blogGlobalSettings} showSidebar={true} />
      <ContentSections sections={page.fields.pageContent} />
    </div>
  )
}

export default CulinaryContestArticle

export async function getStaticPaths() {
  const culinaryContestArticles = await nacelleClient.content({
    type: 'culinaryContestArticle',
    entryDepth: 1
  })

  const handles = culinaryContestArticles.map((article) => ({ params: { handle: article.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    handles: [params.handle],
    type: 'culinaryContestArticle'
  })

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const page = pages[0]

  const props = {
    page,
    blogSettings: blogSettings[0],
    product: null
  }

  if (page.fields?.content) {
    const handles = page.fields.content.filter(item => item._type === 'productBlock').map(item => item.product)
    let { products } = await nacelleClient.query({
      query: GET_PRODUCTS,
      variables: {
        "filter": {
          "handles": [...handles]
        }
      }
    })
    if (products) {
      props.product = products[0]
    }
  }

  return {
    props
  }
}