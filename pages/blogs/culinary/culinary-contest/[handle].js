import { useEffect, useState } from 'react'
import ArticleContestForm from '@/components/Article/ArticleContestForm'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import ContentSections from '@/components/Sections/ContentSections'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'
import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'

const CulinaryContestArticle = ({ page, product, blogSettings, modals }) => {

  const blogGlobalSettings = blogSettings ? blogSettings.fields['culinary'] : undefined

  const modalContext = useModalContext()
  const [mounted, setMounted] = useState(false)
  const customerContext = useCustomerContext()
  const { customer } = customerContext
  const {articleTags} = page.fields

  useEffect(() => {
    setMounted(true)

    if (!articleTags) {
      return
    }

    const foundVisibleTags = articleTags.reduce((carry, tag) => {
      if (tag.value.toLowerCase().includes('visible')) {
        const splitTag = tag.value.split(':')[1].trim()
        const splitTagWithoutDash = splitTag?.replace(/-/g, '').replace(/ /g, '').toLowerCase()
        return [...carry, splitTagWithoutDash]
      }
      return carry
    }, [])

    const articleHasCustomerTag = customer?.tags.some(tag => {
      const customerTagWithoutDash = tag.replace(/-/g, '').toLowerCase()
      return foundVisibleTags.some(tag => customerTagWithoutDash.indexOf(tag) > -1)
    })

    modalContext.setArticleCustomerTag(articleHasCustomerTag)

    const hierarchy = [
      'kingsustainer',
      'sockeyesustainer',
      'prepaid',
      'member'
    ]

    const foundModal = modals.reduce((carry, modal) => {
      const modalHandleWithoutDash = modal.handle.replace(/-/g, '')
      if (foundVisibleTags.some(tag => tag.indexOf(modalHandleWithoutDash) > -1)) {
        if (!carry.handle) return modal
        if (hierarchy.indexOf(modalHandleWithoutDash) < hierarchy.indexOf(carry.handle.replace(/-/g, ''))) {
          return modal
        }
      }
      return carry
    }, {})

    // if product tags exist but none of the product tags match customer tag
    if(foundVisibleTags.length > 0 && !articleHasCustomerTag && foundModal.fields) {
      modalContext.setContent(foundModal.fields)
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

  }, [customer, modalContext.isOpen])

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

  const modals = await nacelleClient.content({
    type: 'gatedArticleModal'
  })

  if (!pages.length && !pages[0].fields.published) {
    return {
      notFound: true
    }
  }

  const page = pages[0]

  const props = {
    page,
    blogSettings: blogSettings[0],
    product: null,
    modals: modals
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