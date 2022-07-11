import { ProductSD, BreadcrumbSD, RecipeSD, VideoSD } from './components'

const StructuredData = ({ type, data }) => {
  switch (type) {
    case 'product':
      return <ProductSD data={data} />
    case 'breadcrumb':
      return <BreadcrumbSD />
    case 'recipe':
      return <RecipeSD data={data} />
    case 'video':
      return <VideoSD data={data} />
    default:
      return ''
  }
}

export default StructuredData