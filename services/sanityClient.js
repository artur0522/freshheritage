import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-08-31',
  useCdn: true
})