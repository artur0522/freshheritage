import {
  Highlight,
  Index,
  InstantSearch,
  useInstantSearch,
} from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'
import { simple } from 'instantsearch.js/es/lib/stateMappings'
import algoliasearch from 'algoliasearch/lite'
import { useState, useEffect } from 'react'

import ArticleHits from '@/components/Search/ArticleHits'
import ProductHits from '@/components/Search/ProductHits'
import CustomSearchBox from '@/components/Search/CustomSearchBox'
import CustomRefinementList from '@/components/Search/CustomRefinementList'

import classes from './Search.module.scss'
import 'instantsearch.css/themes/reset.css'
import 'instantsearch.css/themes/satellite.css'

const searchClient = algoliasearch('9RTKNI42PN', '4876c2b9c59451c3b189e5bd892dfc9f')

const Hit = ({ hit }) => {
    return (
      <article>
        <Highlight attribute="title" hit={hit} />
      </article>
    )
}

const routing = {
  router: history({
    getLocation() {
      if (typeof window !== 'undefined') {
        return window.location
      }
      return new URL(serverUrl)
    },
  }),
  stateMapping: simple(),
}

const IndexResultsLength = (props) => {
  const { indexId, hide } = props
  const { scopedResults } = useInstantSearch(props)
  const foundScoped = scopedResults?.find(index => index.indexId === indexId)

  return (
    <span style={{ marginLeft: '4px' }} className={hide ? 'display--none' : ''}>
      ({foundScoped?.results?.nbHits})
    </span>
  )
}

const Search = () => {
  const [currentIndex, setCurrentIndex] = useState("prod_shopify_products")

  useEffect(() => {
    console.log(currentIndex)
  }, [currentIndex])

  return (
    <div className={`${classes['search']} container`}>
      <InstantSearch 
        searchClient={searchClient}
        indexName="brand_articles" 
        routing={routing}
      >

        <IndexResultsLength indexId={'culinary_articles'} hide={true} />
        <Index className={classes['index']} indexName="culinary_articles"></Index>
        <Index className={classes['index']} indexName="brand_articles"></Index>
        <Index className={classes['index']} indexName="prod_shopify_products"></Index>

        <div className={classes['header']}>
          <h1>Search Results</h1>
          <CustomSearchBox />
        </div>

        <div className={classes['results-wrap']}>
          <div className={classes['hits']}>
            {currentIndex === "culinary_articles" && <div className={classes['hits-group']}>
                <Index className={classes['index']} indexName="culinary_articles">

                  <div className={classes['filters-wrap']}>
                    <div className={classes['tab-btns']}>
                      <button className={`${currentIndex === 'prod_shopify_products' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("prod_shopify_products")}>
                        Products
                        <IndexResultsLength indexId={'prod_shopify_products'} hide={false} />
                      </button>
                      <button className={`${currentIndex === 'culinary_articles' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("culinary_articles")}>
                        Culinary Resources
                        <IndexResultsLength indexId={'culinary_articles'} hide={false} />
                      </button>
                      <button className={`${currentIndex === 'brand_articles' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("brand_articles")}>
                        Articles
                        <IndexResultsLength indexId={'brand_articles'} hide={false} />
                      </button>
                    </div>
                    <div className={classes['refinement-wrap']}>
                      <h5>Culinary Filters</h5>
                      <CustomRefinementList attribute='_type' />
                    </div>
                  </div>
                 
                  <div className={classes['hits-row']}>
                    <ArticleHits hitComponent={Hit} />
                  </div>
                </Index>

            </div>}

            {currentIndex === "brand_articles" && <div className={classes['hits-group']}>
                <Index className={classes['index']} indexName="brand_articles">

                  <div className={classes['filters-wrap']}>
                    <div className={classes['tab-btns']}>
                      <button className={`${currentIndex === 'prod_shopify_products' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("prod_shopify_products")}>
                        Products
                        <IndexResultsLength indexId={'prod_shopify_products'} hide={false} />
                      </button>
                      <button className={`${currentIndex === 'culinary_articles' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("culinary_articles")}>
                        Culinary Resources
                        <IndexResultsLength indexId={'culinary_articles'} hide={false} />
                      </button>
                      <button className={`${currentIndex === 'brand_articles' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("brand_articles")}>
                        Articles
                        <IndexResultsLength indexId={'brand_articles'} hide={false} />
                      </button>
                    </div>
                    <div className={classes['refinement-wrap']}>
                      <h5>Brand Filters</h5>
                      <CustomRefinementList attribute='_type' />
                    </div>
                  </div>
                  <div className={classes['hits-row']}>
                    <ArticleHits hitComponent={Hit} />
                  </div>
                </Index>
            </div>}
            
            {currentIndex === "prod_shopify_products" && <div className={classes['hits-group']}>
              <Index className={classes['index']} indexName="prod_shopify_products">
             
                <div className={classes['filters-wrap']}>
                  <div className={classes['tab-btns']}>
                      <button className={`${currentIndex === 'prod_shopify_products' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("prod_shopify_products")}>
                        Products
                        <IndexResultsLength indexId={'prod_shopify_products'} hide={false} />
                      </button>
                      <button className={`${currentIndex === 'culinary_articles' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("culinary_articles")}>
                        Culinary Resources
                        <IndexResultsLength indexId={'culinary_articles'} hide={false} />
                      </button>
                      <button className={`${currentIndex === 'brand_articles' ? classes['active'] : ''} h5`} onClick={() => setCurrentIndex("brand_articles")}>
                        Articles
                        <IndexResultsLength indexId={'brand_articles'} hide={false} />
                      </button>
                  </div>
                  <div className={classes['refinement-wrap']}>
                    <h5>Product Filters</h5>
                    <CustomRefinementList attribute='product_type' />
                  </div>
                </div>
                <div className={classes['hits-row']}>
                  <ProductHits hitComponent={Hit} />
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