import {useEffect, useState, useRef} from 'react'
import {
    Highlight,
    Index,
    InstantSearch,
    useInstantSearch
  } from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'
import { simple } from 'instantsearch.js/es/lib/stateMappings'
import algoliasearch from 'algoliasearch/lite'
import Link from 'next/link'
import { useSearchModalContext } from '@/context/SearchModalContext'
import CustomSearchBox from '@/components/Search/CustomSearchBox'
import IconClose from '@/svgs/close.svg'
import ModalArticleHits from '@/components/Search/ModalArticleHits/ModalArticleHits'
import ModalProductHits from '@/components/Search/ModalProductHits'

import { CSSTransition } from 'react-transition-group'
import classes from './SearchModal.module.scss'
import 'instantsearch.css/themes/reset.css'
import 'instantsearch.css/themes/satellite.css'

const SearchModal = () => {
  const searchModalContext = useSearchModalContext()
  const { searchOpen, searchLinks } = searchModalContext
  const [mounted, setMounted]= useState(false) 
  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 200

  useEffect(() => {
    setMounted(true)
    setTimeout(() => {
    setDrawerOpen(true)
    }, timeout)
  }, [])

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
        searchModalContext.setSearchOpen(false)
    }, timeout)
  }

  const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID, process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY)

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

  const Hit = ({ hit }) => {
      return (
        <article>
          <Highlight attribute="title" hit={hit} />
        </article>
      )
  }

  const QueryState = (props) => {
    const { results } = useInstantSearch(props)

    return (
      <>
        {results?.query === '' ? <div className={classes['search-results']}>
          <h4 className={"heading--search-results"}>Popular Searches</h4>
          <ul>
            {searchLinks?.menuItems.map((link) => {
              return (
                <li key={link._key}>
                  <Link href={link.linkUrl}>
                    <a className="h6">{link.linkText}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div> :
        <>
          <h4>Top Search Results</h4>
          <div className={classes['indicies']}>
            <Index className={classes['index']} indexName="prod_shopify_products">
              <ModalProductHits hitComponent={Hit} indexId="prod_shopify_products" />
            </Index>

            <Index className={classes['index']} indexName="culinary_articles">
              <ModalArticleHits hitComponent={Hit} indexId="culinary_articles" />
            </Index>

            <Index className={classes['index']} indexName="brand_articles">
              <ModalArticleHits hitComponent={Hit} indexId="brand_articles" />
            </Index>
          </div>
        </>
        }
      </>
    )
  }

  if(searchOpen && mounted) {
    return (
      <div className={classes['pdp-flyout']}>
        <div onClick={() => closeDrawer()} className={classes['pdp-flyout__overlay']}></div>
        <CSSTransition in={drawerOpen} timeout={timeout} nodeRef={nodeRef} unmountOnExit classNames={{
            'enter': classes['pdp-flyout__content--enter'],
            'enterActive': classes['pdp-flyout__content--enter-active'],
            'enterDone': classes['pdp-flyout__content--enter-done'],
            'exit': classes['pdp-flyout__content--exit'],
            }}>
            <div ref={nodeRef} className={classes['pdp-flyout__content']}>
                <div className={classes['searchbox-close']}>
                  <button className="body" onClick={() => closeDrawer()}>
                    <IconClose />
                  </button>
                </div>
                <div className={classes['content']}>
                    <InstantSearch 
                        searchClient={searchClient}
                        indexName="brand_articles" 
                        routing={routing}
                    >
                      <div className={classes['search-header']}>
                        <div className={classes['searchbox-wrap']}>
                            <CustomSearchBox />
                        </div>
                        <button className="body" onClick={() => closeDrawer()}>
                          <IconClose />
                        </button>
                      </div>
                      
                      <div className={classes['search-results']}>
                        <QueryState />
                      </div>
                    </InstantSearch>
                </div>
            </div>
        </CSSTransition>
      </div>
    )
  } else {
    return null
  } 
}

export default SearchModal