import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'shh4ldkk',
  dataset: 'production', 
  useCdn: true
})