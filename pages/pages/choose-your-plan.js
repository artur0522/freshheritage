import { useEffect } from 'react'
import { useRouter } from "next/router";
import { nacelleClient } from 'services'
import ChooseYourBox from '@/components/PurchaseFlow/ChooseYourBox'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { GET_PRODUCTS } from '@/gql/index.js'
import PageSEO from '@/components/SEO/PageSEO'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import { getRecentArticlesHandles } from '@/utils/getRecentArticleHandles';
import { dataLayerViewProductList } from '@/utils/dataLayer';

const PurchaseFlow = ({page, tierOptions}) => {
  const router = useRouter();
  const purchaseFlowContext = usePurchaseFlowContext()

  useEffect(() => {
    dataLayerViewProductList({products: tierOptions, url: router.asPath})
  }, [])

  if (purchaseFlowContext.options.is_loaded) {
    return (
      <>
        <PageSEO seo={page.seo} />
        <ChooseYourBox tierOptions={tierOptions} props={page} />
      </>
    )
  }
  return ''
}

export async function getStaticProps() {
  const page = await nacelleClient.content({
    type: 'purchaseFlow'
  })

  const fullRefPage = await getNacelleReferences(page[0])
  const { fields } = fullRefPage
  const { step1 } = fields
  const tiers = [...step1.tiers.map(tier => tier.product), 'sitka-seafood-intro-box'];

  const variables = `{
    "filter": {
      "handles": ${JSON.stringify(tiers)}
    }
  }`

  let tierOptions = await nacelleClient.query({
    query: GET_PRODUCTS,
    variables
  });

  tierOptions = tierOptions.products.map(tierOption => {
    return {
      ...tierOption,
      markAsMostPopular: step1.tiers.some(tier => tier.markAsMostPopular && tierOption.content?.handle === tier.product)
    }
  })

  if (fullRefPage?.fields?.content?.some(content => content._type === 'featuredBlogContent')) {
    await getRecentArticlesHandles(fullRefPage.fields.content)
  }

  return {
    props: {
      page: step1,
      tierOptions,
      handle: 'purchase-flow'
    }
  }
}


export default PurchaseFlow