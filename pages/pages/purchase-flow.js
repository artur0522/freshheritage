import React from 'react'
import { nacelleClient } from 'services'
import ChooseYourBox from '@/components/PurchaseFlow/ChooseYourBox'
import CustomizeYourPlan from '@/components/PurchaseFlow/CustomizeYourPlan'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'

const PurchaseFlow = ({page}) => {

  const purchaseFlowContext = usePurchaseFlowContext()

  const { fields } = page[0]
  const { step1 } = fields
  const { step2 } = fields

  if (!purchaseFlowContext.options.is_loaded) {
    return ''
  }

  return (
    <div>
      {purchaseFlowContext.options.step === 1 &&
        <ChooseYourBox props={step1} />
      }
      {purchaseFlowContext.options.step === 2 &&
        <CustomizeYourPlan props={step2} />
      }
    </div>
  )
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