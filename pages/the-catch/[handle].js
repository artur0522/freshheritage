import React, { useEffect, useState } from 'react'

import { useCustomerContext } from '@/context/CustomerContext'
import { useTheCatchContext } from '@/context/TheCatchContext'

import ContentSections from '@/components/Sections/ContentSections'

import { nacelleClient } from 'services'

const TheCatch = (props) => {
    const { page } = props
    const customerContext = useCustomerContext()
    const theCatchContext = useTheCatchContext()
    const { customer } = customerContext
    const { addIssue, addFilteredIssue, monthName } = theCatchContext
    
    useEffect(() => {
        const filtered = page.fields?.content?.filter(content => content._type === 'staticHarvest')
        const found = filtered.find(staticHarvest => staticHarvest.harvestMonth[0].month.toLowerCase() === monthName)

        addIssue(page)
        addFilteredIssue(found)
    }, [])

    return (
        <> 
            <ContentSections sections={page.fields.content} />
        </>
    )
}

export default TheCatch

export async function getStaticPaths() {
    const theCatchPages = await nacelleClient.content({
        type: 'theCatch'
    })
  
    const handles = theCatchPages.map((page) => ({ params: { handle: page.handle }}))
  
    return {
      paths: handles,
      fallback: 'blocking'
    }
}
  
export async function getStaticProps({ params }) {
    const pages = await nacelleClient.content({
      handles: [params.handle],
      type: 'theCatch'
    })

    const foundPage = pages.find(page => page.handle === params.handle)

    if (!pages.length) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        page: foundPage,
        extraPages: pages,
        handle: params.handle
      }
    }
}
  