import { RecipeJsonLd } from 'next-seo'
import moment from 'moment'

const RecipeSD = ({ data }) => {

  if (!data.fields.seo || !data.fields.structuredData) {
    return ''
  }

  const {activeTime, cookTime, totalTime} = data.fields.hero
  const { metaTitle = '', metaDesc = '', shareGraphic = undefined } = data.fields.seo
  const content = data.fields.content
  const { author = '' } = data.fields.sidebar
  const { calories = '', keywords = '', category = '', cuisine = '' } = data.fields.structuredData
  const images = []

  if (shareGraphic) {
    images.push(shareGraphic.asset.url)
  }

  if (content) {
    content.forEach(item => {
      if (item._type === 'image') {
        const image = item.asset.url
        images.push(image)
      }
    })
  } else {
    return ''
  }

  let currentContentSectionHeading = ''
  let currentContentSectionSubheading = ''

  const contentObj = content.reduce((carry, item) => {
    if (item.style == 'h1') {
      currentContentSectionHeading = item.children[0].text.toLowerCase()
      carry[currentContentSectionHeading] = []
      currentContentSectionSubheading = ''
    } else if (item.style == 'h2') {
      currentContentSectionSubheading = item.children[0].text
      carry[currentContentSectionHeading][currentContentSectionSubheading] = []
    } else if (item.children) {
      const text = item.children.map(child => child.text).join(' ')
      if (text !== '') {
        if (currentContentSectionSubheading !== '') {
          carry[currentContentSectionHeading][currentContentSectionSubheading] = [...carry[currentContentSectionHeading][currentContentSectionSubheading], text]
        } else if (carry[currentContentSectionHeading]) {
          carry[currentContentSectionHeading] = [...carry[currentContentSectionHeading], text]
        }
      }
    }
    return carry
  }, {})

  const directions = Object.keys(contentObj.directions).map(key => {
    const value = contentObj['directions'][key]
    return {
      name: key,
      text: Array.isArray(value) > 1 ? value.join('') : value
    }
  })

  let datePublished = moment.unix(data.createdAt).format('MM/DD/YYYY')

  if (data.fields?.publishedDate) {
    datePublished = moment(data.fields.publishedDate).format('MM/DD/YYYY')
  }

  return (
    <RecipeJsonLd
      name={metaTitle}
      description={metaDesc}
      datePublished={datePublished}
      authorName={[author.name]}
      prepTime={activeTime}
      cookTime={cookTime}
      totalTime={totalTime}
      keywords={keywords}
      category={category}
      cuisine={cuisine}
      calories={calories}
      images={images}
      instructions={directions}
      // aggregateRating={{
      //   ratingValue: '5',
      //   ratingCount: '18',
      // }}
    />
  )
};

export default RecipeSD;