import { nacelleClient } from 'services'
import ChooseYourBox from '@/components/PurchaseFlow/ChooseYourBox'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { GET_PRODUCTS } from '@/gql/index.js';

const PurchaseFlow = ({page, tierOptions}) => {
  const purchaseFlowContext = usePurchaseFlowContext()
  if (purchaseFlowContext.options.is_loaded) {
    return <ChooseYourBox tierOptions={tierOptions} props={page} />
  }
  return ''
}

export async function getStaticProps() {
  const page = await nacelleClient.content({
    type: 'purchaseFlow'
  })

  const { fields } = page[0]
  const { step1 } = fields
  const tiers = [...step1.tiers.map(tier => tier.product), 'intro-box'];

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
      markAsMostPopular: step1.tiers.some(tier => tier.markAsMostPopular && tierOption.content.handle === tier.product)
    }
  })

  return {
    props: {
      page: step1,
      tierOptions,
      handle: 'purchase-flow'
    }
  }
}


export default PurchaseFlow