
import classes from './IndexButton.module.scss'

const IndexButton = (props) => {
    const { indexId, hide, currentIndex, setCurrentIndex } = props

    return (
      <button className={`${classes['tab-btn']} ${currentIndex === indexId ? classes['active'] : ''} ${hide ? 'display--none' : ''} h5 tab-btn`} onClick={() => setCurrentIndex(indexId)}>
        {indexId === 'all_results' && 'All Results'}
        {indexId === 'products' && 'Products'}
        {indexId === 'culinary_articles' && 'Culinary Resources'}
        {indexId === 'brand_articles' && 'Articles'}
        
        {/* <span style={{ marginLeft: '4px' }}>
          ({foundScoped?.results?.nbHits})
        </span> */}
      </button>
    )
}

export default IndexButton
  