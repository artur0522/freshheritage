import { nacelleClient } from 'services'
import CustomizeYourPlan from '@/components/PurchaseFlow/CustomizeYourPlan'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'

const PurchaseFlow = ({page}) => {
  const purchaseFlowContext = usePurchaseFlowContext()

  const { fields } = page[0]
  const { step2 } = fields

  if (purchaseFlowContext?.options.is_loaded) {
    return <CustomizeYourPlan props={step2} />
  }
  return ''
}

export async function getStaticProps() {
  const page = await nacelleClient.content({
    type: 'purchaseFlow'
  })
  return {
    props: {
      page,
      handle: 'purchase-flow'
    }
  }
}


export default PurchaseFlow