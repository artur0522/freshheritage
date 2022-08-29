import classes from './SelectInput.module.scss'

const SelectInput = (props) => {
  const {currentIndex, setCurrentIndex } = props

  return (
    <select className={classes['select']} value={currentIndex} onChange={(e) => setCurrentIndex(e.target.value)}>
        <option value="all_results">All Results</option>
        <option value="prod_shopify_products">Products</option>
        <option value="culinary_articles">Culinary Resources</option>
        <option value="brand_articles">Articles</option>
    </select>
  )
}

export default SelectInput