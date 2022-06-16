import { nacelleClient } from 'services'
import ChooseYourBox from '@/components/PurchaseFlow/ChooseYourBox'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'

const PurchaseFlow = ({page}) => {
  const purchaseFlowContext = usePurchaseFlowContext()

  const { fields } = page[0]
  const { step1 } = fields

  if (purchaseFlowContext?.options.is_loaded) {
    return <ChooseYourBox props={step1} />
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