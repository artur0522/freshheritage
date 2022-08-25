import {
  Highlight,
  Index,
  InstantSearch,
} from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'
import algoliasearch from 'algoliasearch/lite'
import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

import ArticleHits from '@/components/Search/ArticleHits'
import ProductHits from '@/components/Search/ProductHits'
import CustomSearchBox from '@/components/Search/CustomSearchBox'
import CustomRefinementList from '@/components/Search/CustomRefinementList'
import IndexButton from '@/components/Search/IndexButton'
import SelectInput from '@/components/Search/SelectInput'

import classes from './Search.module.scss'
import 'instantsearch.css/themes/reset.css'
import 'instantsearch.css/themes/satellite.css'

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID, process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY)

const Hit = ({ hit }) => {
    return (
      <article>
        <Highlight attribute="title" hit={hit} />
      </article>
    )
}

const Search = () => {
  const [currentIndex, setCurrentIndex] = useState("all_results")
  const [mounted, setMounted] = useState(false)

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 768px)'}
  )

  useEffect(() => {
    setMounted(true)
  }, [mounted])

  return (
    <div className={`${classes['search']} container`}>
      <InstantSearch 
        searchClient={searchClient}
        indexName="brand_articles" 
      >

        <div className={classes['header']}>
          <h1>Search Results</h1>
          <div className={classes['searchbox-wrap']}>
            <CustomSearchBox />
          </div>
        </div>

        <div className={classes['results-wrap']}>
          <div className={classes['hits']}>
            {currentIndex === "all_results" && <div className={classes['hits-group']}>
                  <div className={classes['filters-wrap']}>
                    <div className={classes['refinement-wrap']}>
                      {mounted && isDesktop && <IndexButton indexId='all_results' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                      {mounted && isDesktop && <IndexButton indexId='prod_shopify_products' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
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
                  </div>
            </div>}

            {currentIndex === "culinary_articles" && <div className={classes['hits-group']}>
                <Index className={classes['index']} indexName="culinary_articles">

                  <div className={classes['filters-wrap']}>
                    <div className={classes['refinement-wrap']}>
                      {/* <Index className={classes['index']} indexName="culinary_articles"></Index>
                      <Index className={classes['index']} indexName="brand_articles"></Index>
                      <Index className={classes['index']} indexName="prod_shopify_products"></Index> */}
                      
                      {mounted && isDesktop && <IndexButton indexId='all_results' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                      {mounted && isDesktop && <IndexButton indexId='prod_shopify_products' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                      {mounted && isDesktop && <IndexButton indexId='culinary_articles' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                      {mounted && isDesktop && <IndexButton indexId='brand_articles' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                                          
                      {mounted && isMobile && <SelectInput currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />}
                      <CustomRefinementList attribute='blog.title' header="Culinary Filters"/>
                    </div>
                  </div>
                 
                  <div className={classes['hits-row']}>
                    <ArticleHits hitComponent={Hit} indexId="culinary_articles" />
                  </div>
                </Index>
            </div>}

            {currentIndex === "brand_articles" && <div className={classes['hits-group']}>
                <Index className={classes['index']} indexName="brand_articles">
                  <div className={classes['filters-wrap']}>
                    <div className={classes['refinement-wrap']}>
                      {/* <Index className={classes['index']} indexName="culinary_articles"></Index>
                      <Index className={classes['index']} indexName="brand_articles"></Index>
                      <Index className={classes['index']} indexName="prod_shopify_products"></Index> */}

                      {mounted && isDesktop && <IndexButton indexId='all_results' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                      {mounted && isDesktop && <IndexButton indexId='prod_shopify_products' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                      {mounted && isDesktop && <IndexButton indexId='culinary_articles' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                      {mounted && isDesktop && <IndexButton indexId='brand_articles' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}

                      {mounted && isMobile && <SelectInput currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />}
                      <CustomRefinementList attribute='blog.title' header="Brand Filters" />
                    </div>
                  </div>
                  <div className={classes['hits-row']}>
                    <ArticleHits hitComponent={Hit} indexId="brand_articles" />
                  </div>
                </Index>
            </div>}
            
            {currentIndex === "prod_shopify_products" && <div className={classes['hits-group']}>
              <Index className={classes['index']} indexName="prod_shopify_products">
                <div className={classes['filters-wrap']}>
                  <div className={classes['refinement-wrap']}>
                    {/* <Index className={classes['index']} indexName="culinary_articles"></Index>
                    <Index className={classes['index']} indexName="brand_articles"></Index>
                    <Index className={classes['index']} indexName="prod_shopify_products"></Index> */}
                    
                    {mounted && isDesktop && <IndexButton indexId='all_results' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                    {mounted && isDesktop && <IndexButton indexId='prod_shopify_products' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                    {mounted && isDesktop && <IndexButton indexId='culinary_articles' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}
                    {mounted && isDesktop && <IndexButton indexId='brand_articles' hide={false} currentIndex={currentIndex}  setCurrentIndex={setCurrentIndex} />}

                    {mounted && isMobile && <SelectInput currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />}
                    <CustomRefinementList attribute='product_type' header="Product Filters" />
                  </div>
                </div>
                <div className={classes['hits-row']}>
                  <ProductHits hitComponent={Hit} indexId="prod_shopify_products" />
                </div>
              </Index>
            </div>}

          </div>
        </div>
      </InstantSearch>
    </div>
  )
}

export default Search