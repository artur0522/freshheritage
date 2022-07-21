import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'shh4ldk',
  dataset: 'production', 
  useCdn: true
})