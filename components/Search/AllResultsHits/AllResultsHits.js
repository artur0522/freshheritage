import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
    Highlight,
    Index,
    useInstantSearch
} from 'react-instantsearch-hooks-web'

import ArticleHits from '@/components/Search/ArticleHits'
import ProductHits from '@/components/Search/ProductHits'
import IndexButton from '@/components/Search/IndexButton'
import SelectInput from '@/components/Search/SelectInput'

import classes from "./AllResultsHits.module.scss"

const Hit = ({ hit }) => {
    return (
      <article>
        <Highlight attribute="title" hit={hit} />
      </article>
    )
}

const AllResultsHits = (props) => {
    const {currentIndex, setCurrentIndex} = props
    const [mounted, setMounted] = useState(false)
    const { scopedResults } = useInstantSearch(props)
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    const isDesktop = useMediaQuery(
        {query: '(min-width: 768px)'}
    )
    const noResultsForAllIndexes = scopedResults.every(index => index?.results?.nbHits === 0)

    useEffect(() => {
        setMounted(true)
    }, [mounted])

    
    return (
        <div className={classes['hits-group']}>
            <div className={classes['filters-wrap']}>
                <div className={classes['refinement-wrap']}>
                    {mounted && isDesktop && <IndexButton indexId='all_results' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                    {mounted && isDesktop && <IndexButton indexId='products' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                    {mounted && isDesktop && <IndexButton indexId='culinary_articles' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                    {mounted && isDesktop && <IndexButton indexId='brand_articles' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}

                    {mounted && isMobile && <SelectInput currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />}
                </div>
            </div>
            
            <div className={classes['hits-row']}>
            <Index className={classes['index']} indexName="prod_shopify_products">
                <ProductHits hitComponent={Hit} indexId="prod_shopify_products" currentIndex={currentIndex} />
            </Index>
            <Index className={classes['index']} indexName="culinary_articles">
                <ArticleHits hitComponent={Hit} indexId="culinary_articles" currentIndex={currentIndex} />
            </Index>
            <Index className={classes['index']} indexName="brand_articles">
                <ArticleHits hitComponent={Hit} indexId="brand_articles" currentIndex={currentIndex} />
            </Index>

            {noResultsForAllIndexes && <div className={classes['no-results']}>
                <h4>Sorry, we could not find anything for <span>&#34;{decodeURI(scopedResults[0]?.results?.query)}&#34;</span></h4>
                <p className="secondary--body">Try a different search term</p>
            </div>}
            </div>
        </div>
    )
}

export default AllResultsHits