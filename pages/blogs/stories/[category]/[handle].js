import { useState, useEffect } from 'react'
import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import ContentSections from '@/components/Sections/ContentSections'
import StructuredData from '@/components/SEO/StructuredData'
import PageSEO from '@/components/SEO/PageSEO'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import moment from 'moment'

const BrandArticle = ({ page, products, blogSettings, modals }) => {
  const { hero, articleTags } = page.fields
  const blogType = page.fields.blog?.blogType
  const blogGlobalSettings = blogSettings ? { ...blogSettings.fields[blogType], blogType} : undefined
  hero.header = page.title
  hero.subheader = page.fields.subheader

  const modalContext = useModalContext()
  const [mounted, setMounted] = useState(false)
  const customerContext = useCustomerContext()
  const { customer } = customerContext

  let datePublished = moment.unix(page.createdAt).format('MMMM DD, YYYY')
  if (page.fields?.publishedDate) {
    datePublished = moment(page.fields.publishedDate).format('MMMM DD, YYYY')
  }

  useEffect(() => {
    setMounted(true)

    if (!articleTags) {
      return
    }

    const foundVisibleTags = articleTags.filter(tag => tag.value.toLowerCase().includes('visible'))
    const splitTag = foundVisibleTags[0]?.value?.split(':')[1].trim()
    const splitTagWithDash = splitTag?.replace(/\s/g, '-').toLowerCase()

    const articleHasCustomerTag = customer?.tags.some(tag => tag.toLowerCase().indexOf(splitTag))

    modalContext.setArticleCustomerTag(articleHasCustomerTag)

    const foundModal = modals.find(modal => modal.handle.replace(/-/g, '').includes(splitTagWithDash))

    // if product tags exist but none of the product tags match customer tag
    if(foundVisibleTags.length > 0 && !articleHasCustomerTag) {
      if(foundModal) {
        modalContext.setPrevContent(foundModal?.fields)
        modalContext.setContent(foundModal?.fields)
        modalContext.setModalType('gated_product')
        modalContext.setIsOpen(true)
      }
    }

    // if one of the product tags contains customer tag
    if(foundVisibleTags.length > 0 && articleHasCustomerTag) {
      modalContext.setIsOpen(false)
    }

    // if visible tags dont exist
    if(foundVisibleTags.length === 0) {
      modalContext.setIsOpen(false)
    }

  }, [customer])

  return (
    <>
      <StructuredData type="article" data={page} />
      <PageSEO seo={page.fields.seo} />
      <ArticleSplitHero fields={hero} renderType="default" blogGlobalSettings={blogGlobalSettings} />
      <ArticleMain contentType="standard" datePublished={datePublished} fields={page.fields} products={products} blogGlobalSettings={blogGlobalSettings} />
      <ContentSections sections={page.fields.pageContent} />
    </>
  )
}

export default BrandArticle

export async function getStaticPaths() {

  const standardArticles = await nacelleClient.content({
    type: 'standardArticle',
    entryDepth: 1
  })

  const validArticles = standardArticles.reduce((carry, article) => {
    // only get brand categories
    const blogType = article.fields.blog.blogType
    if (blogType === 'stories') {
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

  const pages = await nacelleClient.content({
    handles: [params.handle],
    type: 'standardArticle',
    entryDepth: 1
  })

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  if (!pages.length || !pages[0].fields.published) {
    return {
      notFound: true
    }
  }

  const fullRefPage = await getNacelleReferences(pages[0])

  const modals = await nacelleClient.content({
    type: 'gatedArticleModal'
  })

  const props = {
    page: fullRefPage,
    handle: fullRefPage.handle,
    blogSettings: blogSettings[0],
    product: null,
    modals: modals
  }

  if (fullRefPage.fields?.content) {
    const handles = fullRefPage.fields.content.filter(item => item._type === 'productBlock').map(item => item.product)
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
        props.products = data.products
      }
    }
  }

  return {
    props
  }
}
