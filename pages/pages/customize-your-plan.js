import { nacelleClient } from 'services'
import CustomizeYourPlan from '@/components/PurchaseFlow/CustomizeYourPlan'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import PageSEO from '@/components/Layout/PageSEO'

const PurchaseFlow = ({page}) => {
  const purchaseFlowContext = usePurchaseFlowContext()
  if (purchaseFlowContext.options.is_loaded) {
    return (
      <>
        <PageSEO seo={page.seo} />
        <CustomizeYourPlan props={page} />
      </>
    )
  }
  return ''
}

export async function getStaticProps() {
  const page = await nacelleClient.content({
    type: 'purchaseFlow'
  })

  const { fields } = page[0]
  const { step2 } = fields

  return {
    props: {
      page: step2,
      handle: 'purchase-flow'
    }
  }
}


export default PurchaseFlow