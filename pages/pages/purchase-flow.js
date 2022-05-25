import React from 'react'
import { nacelleClient } from 'services'
import ChooseYourBox from '@/components/ChooseYourBox'
import ContentSections from '@/components/ContentSections'

const PurchaseFlow = ({page}) => {
  const { fields } = page[0]
  const { step1 } = fields
  console.log(step1)
  return (
    <div>
      <ChooseYourBox props={step1} />
      <ContentSections sections={step1.content} />
    </div>
  )
}

export async function getStaticProps() {
  const page = await nacelleClient.content({
    type: 'purchaseFlow'
  })
  return {
    props: { page },
  }
}


export default PurchaseFlow