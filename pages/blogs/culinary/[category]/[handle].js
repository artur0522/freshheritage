import { useRef, useEffect } from 'react'
import { useModalContext } from '@/context/ModalContext'
import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import ContentSections from '@/components/Sections/ContentSections'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'

const RecipeArticle = ({ page, product, blogSettings }) => {
  const { setContent } = useModalContext()
  const mainContentRef = useRef()

  const { hero } = page.fields
  if (page.fields.articleTags) {
    hero.tags = page.fields.articleTags
  }
  const blogType = page.fields.blog?.blogType
  const blogGlobalSettings = blogSettings ? { ...blogSettings.fields[blogType], blogType} : undefined
  hero.header = page.title
  hero.subheader = page.fields.subheader

  useEffect(() => {
    if (page.type === 'liveCookingClassArticle') {
      setContent({
        header: page.title,
        classStartDate: page.fields.classStartDate,
        classEndDate: page.fields.classEndDate,
        listId: page.fields.klaviyoListId
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (page.type === 'recipeArticle') {
    return (
      <>
        <StructuredData type="article" data={page} />
        <StructuredData type="recipe" data={page} />
        <PageSEO seo={page.fields.seo} />
        <ArticleSplitHero fields={hero} renderType="recipe" blogGlobalSettings={blogGlobalSettings} />
        <ArticleMain contentType="recipe" showNav={true} fields={page.fields} product={product} blogGlobalSettings={blogGlobalSettings} />
        <ContentSections sections={page.fields.pageContent} />
      </>
    )
  }

  if (page.type === 'videoArticle') {
    return (
      <>
        <StructuredData type="article" data={page} />
        <PageSEO seo={page.fields.seo} />
        <ArticleSplitHero fields={hero} renderType="default" blogGlobalSettings={blogGlobalSettings} />
        <ArticleMain contentType="standard" fields={page.fields} product={product} blogGlobalSettings={blogGlobalSettings} />
        <ContentSections sections={page.fields.pageContent} />
      </>
    )
  }

  if (page.type === 'cookingGuideArticle') {

    const hasVideo = hero.youtubeVideoId ? true : false

    return (
      <div className={`${!hasVideo ? 'article-cooking-guide--no-video' : 'article-cooking-guide'}`}>
        <StructuredData type="article" data={page} />
        <StructuredData type="video" data={page} />
        <PageSEO seo={page.fields.seo} />
        <ArticleSplitHero ref={mainContentRef} fields={hero} renderType="cooking-guide" blogGlobalSettings={blogGlobalSettings} />
        <ArticleMain ref={mainContentRef} contentType="standard" fields={page.fields} product={product} showNav={true} blogGlobalSettings={blogGlobalSettings} />
        <ContentSections sections={page.fields.pageContent} />
      </div>
    )
  }

  if (page.type === 'liveCookingClassArticle') {

    hero.classStartDate = page.fields?.classStartDate
    hero.classEndDate = page.fields?.classEndDate

    if (page.fields?.sidebar?.classSignup && page.fields.klaviyoListId) {
      page.fields.sidebar.classSignup.klaviyoListId = page.fields.klaviyoListId
    }

    return (
      <>
        <StructuredData type="article" data={page} />
        <StructuredData type="video" data={page} />
        <PageSEO seo={page.fields.seo} />
        <ArticleSplitHero fields={hero} renderType="cooking-class" blogGlobalSettings={blogGlobalSettings} />
        <ArticleMain contentType="standard" fields={page.fields} product={product} blogGlobalSettings={blogGlobalSettings} />
        <ContentSections sections={page.fields.pageContent} />
      </>
    )
  }

}

export default RecipeArticle

export async function getStaticPaths() {

  const standardArticles = await nacelleClient.content({
    type: 'standardArticle'
  })

  const recipeArticles = await nacelleClient.content({
    type: 'recipeArticle'
  })

  const cookingGuideArticles = await nacelleClient.content({
    type: 'cookingGuideArticle'
  })

  const liveCookingClassArticles = await nacelleClient.content({
    type: 'liveCookingClassArticle'
  })

  const videoArticles = await nacelleClient.content({
    type: 'videoArticle'
  })

  const validArticles = [...standardArticles, ...recipeArticles, ...cookingGuideArticles, ...liveCookingClassArticles, ...videoArticles].reduce((carry, article) => {
    // only get culinary categories
    const blogType = article.fields.blog.blogType
    if (blogType === 'culinary') {
      return [...carry, {
        category: article.fields.blog.handle.current,
        handle: article.handle
      }]
    }
    return carry
  }, [])

  const handles = validArticles.map((article) => {
    return {
      params: {
        handle: article.handle,
        category: article.category
      }
    }
  })

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const { category, handle } = params

  const pages = await nacelleClient.content({
    handles: [handle]
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const validPage = pages.find(page => {
    console.log("page.fields.blog:", page.fields?.blog);
    return page.fields?.blog?.handle.current === category
  })

  console.log("validPage:", validPage)

  if (!validPage) {
    return {
      notFound: true
    }
  }

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const props = {
    page: validPage,
    handle: validPage.handle,
    blogSettings: blogSettings[0],
    product: null
  }

  if (validPage.fields?.content) {
    const handles = validPage.fields.content.filter(item => item._type === 'productBlock').map(item => item.product)
    if (handles.length) {
      let data = await nacelleClient.query({
        query: GET_PRODUCTS,
        variables: {
          "filter": {
            "handles": [...handles]
          }
        }
      })
      if (data.products && data.products.length) {
        const products = data.products
        props.product = products[0]
      }
    }
  }

  return {
    props
  }
}
