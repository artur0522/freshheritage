import { useEffect } from 'react'
import { nacelleClient } from 'services'
import CustomizeYourPlan from '@/components/PurchaseFlow/CustomizeYourPlan'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { useRouter } from 'next/router'

const PurchaseFlow = ({page}) => {
  const router = useRouter()
  const purchaseFlowContext = usePurchaseFlowContext()

  const { fields } = page[0]
  const { step2 } = fields

  useEffect(() => {
    if (purchaseFlowContext.options.step === 1) {
      router.replace('/pages/choose-your-plan')
    }
  }, [purchaseFlowContext])

  if (!purchaseFlowContext.options.is_loaded) {
    return ''
  }

  return <CustomizeYourPlan props={step2} />
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