import {
  Highlight,
  Hits,
  Index,
  InstantSearch,
  SearchBox
} from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'
import { simple } from 'instantsearch.js/es/lib/stateMappings'
import algoliasearch from 'algoliasearch/lite'
import { useState, useEffect, useCallback } from 'react'
import CustomRefinementList from '@/components/Search/CustomRefinementList'

import classes from './Search.module.scss'
// Include only the reset
import 'instantsearch.css/themes/reset.css';
// or include the full Satellite theme
import 'instantsearch.css/themes/satellite.css';


const searchClient = algoliasearch('9RTKNI42PN', '4876c2b9c59451c3b189e5bd892dfc9f')

function Hit({ hit }) {
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

const Search = () => {
  const [currentIndex, setCurrentIndex] = useState("prod_shopify_products")

  useEffect(() => {
    console.log(currentIndex)
  }, [currentIndex])

  return (
    <div className={`${classes['search']} container`}>
      <InstantSearch 
        searchClient={searchClient} 
        indexName="sandbox_articles" 
        routing={routing}
      >
        <div className={classes['header']}>
          <h1>Search Results</h1>
          <SearchBox />
        </div>

        <div className={classes['results-wrap']}>
          <div className={classes['hits']}>
            <div>
              <button onClick={() => setCurrentIndex("prod_shopify_products")}>Products</button>
              <button onClick={() => setCurrentIndex("sandbox_articles")}>Articles</button>
            </div>

          {currentIndex === "sandbox_articles" && <div className={classes['hits-group']}>
              <Index indexName="sandbox_articles">
                <CustomRefinementList attribute='_type' />
                <div className={classes['hits-row']}>
                  <Hits hitComponent={Hit} />
                </div>
              </Index>
          </div>}
            
          {currentIndex === "prod_shopify_products" && <div className={classes['hits-group']}>
            <Index indexName="prod_shopify_products">
              <CustomRefinementList attribute='product_type' />
              <div className={classes['hits-row']}>
                <Hits hitComponent={Hit} />
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