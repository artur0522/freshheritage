import { useEffect } from 'react'
import { nacelleClient } from 'services'
import ChooseYourBox from '@/components/PurchaseFlow/ChooseYourBox'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import { useRouter } from 'next/router'

const PurchaseFlow = ({page}) => {
  const router = useRouter()
  const purchaseFlowContext = usePurchaseFlowContext()

  const { fields } = page[0]
  const { step1 } = fields

  useEffect(() => {
    if (purchaseFlowContext.options.step === 2) {
      router.push('/pages/customize-your-plan')
    }
  }, [purchaseFlowContext])

  if (!purchaseFlowContext.options.is_loaded) {
    return ''
  }

  return <ChooseYourBox props={step1} />
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