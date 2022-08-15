import { useRef, useEffect, useState } from 'react'
import { useModalContext } from '@/context/ModalContext'
import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import ContentSections from '@/components/Sections/ContentSections'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import { useCustomerContext } from '@/context/CustomerContext'


const RecipeArticle = ({ page, products, blogSettings, modals }) => {

  const { setContent } = useModalContext()
  const mainContentRef = useRef()

  const modalContext = useModalContext()
  const [mounted, setMounted] = useState(false)
  const customerContext = useCustomerContext()
  const { customer } = customerContext

  const { hero, articleTags } = page.fields
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

    setMounted(true)

    if (!articleTags) {
      return
    }

    const foundVisibleTags = articleTags.filter(tag => tag.value.includes('Visible' || 'visible'))
    const splitTag = foundVisibleTags[0]?.value?.split(':')[1]
    const splitTagWithDash = splitTag?.replace(/\s/g, '-').toLowerCase()
    const foundCustomerTag = customer?.tags.find(tag => tag.includes('member' || 'Member') || tag.includes('sustainer' || 'sustainer'))

    const articleHasCustomerTag = foundVisibleTags?.find((tag) => {
      let splitTag = tag.value.split(':')[1] === foundCustomerTag
      if(splitTag) {
        return splitTag
      } else {
        return null
      }
    })

    modalContext.setArticleCustomerTag(articleHasCustomerTag)

    const foundModal = modals.find(modal => modal.handle === splitTagWithDash)
    const defaultModal = modals.find(modal => modal.handle === 'non-member')

    // if product tags exist but none of the product tags match customer tag
    if(foundVisibleTags.length > 0 && !articleHasCustomerTag) {
      if(foundModal) {
        modalContext.setPrevContent(foundModal?.fields)
        modalContext.setContent(foundModal?.fields)
      } else {
        modalContext.setPrevContent(defaultModal?.fields)
        modalContext.setContent(defaultModal?.fields)
      }
      modalContext.setModalType('gated_product')
      modalContext.setIsOpen(true)
    }

    // if one of the product tags contains customer tag
    if(foundVisibleTags.length > 0 && articleHasCustomerTag) {
      modalContext.setIsOpen(false)
    }

    // if visible tags dont exist
    if(foundVisibleTags.length === 0) {
      modalContext.setIsOpen(false)
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
        <ArticleMain contentType="recipe" showNav={true} fields={page.fields} products={products} blogGlobalSettings={blogGlobalSettings} />
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
        <ArticleMain contentType="standard" fields={page.fields} products={products} blogGlobalSettings={blogGlobalSettings} />
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
        <ArticleMain ref={mainContentRef} contentType="standard" fields={page.fields} products={products} showNav={true} blogGlobalSettings={blogGlobalSettings} />
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
        <ArticleMain contentType="standard" fields={page.fields} products={products} blogGlobalSettings={blogGlobalSettings} />
        <ContentSections sections={page.fields.pageContent} />
      </>
    )
  }

  // else return standard article
  return (
    <>
      <StructuredData type="article" data={page} />
      <PageSEO seo={page.fields.seo} />
      <ArticleSplitHero fields={hero} renderType="default" blogGlobalSettings={blogGlobalSettings} />
      <ArticleMain contentType="standard" fields={page.fields} products={products} blogGlobalSettings={blogGlobalSettings} />
      <ContentSections sections={page.fields.pageContent} />
    </>
  )

}

export default RecipeArticle

export async function getStaticPaths() {

  const standardArticles = await nacelleClient.content({
    type: 'standardArticle',
    entryDepth: 1
  })

  const recipeArticles = await nacelleClient.content({
    type: 'recipeArticle',
    entryDepth: 1
  })

  const cookingGuideArticles = await nacelleClient.content({
    type: 'cookingGuideArticle',
    entryDepth: 1
  })

  const liveCookingClassArticles = await nacelleClient.content({
    type: 'liveCookingClassArticle',
    entryDepth: 1
  })

  const videoArticles = await nacelleClient.content({
    type: 'videoArticle',
    entryDepth: 1
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
    handles: [handle],
    entryDepth: 1
  })

  console.log(pages)

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const fullRefPages = await getNacelleReferences(pages)

  const validPage = fullRefPages.find((page) => {
    return page.fields?.blog?.handle.current === category
  })

  if (!validPage) {
    return {
      notFound: true
    }
  }

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const modals = await nacelleClient.content({
    type: 'gatedArticleModal'
  })

  const props = {
    page: validPage,
    handle: validPage.handle,
    blogSettings: blogSettings[0],
    product: null,
    modals: modals
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
        props.products = products.filter(product => product.tags.includes('Subscription Box'))
      }
    }
  }

  return {
    props
  }
}
