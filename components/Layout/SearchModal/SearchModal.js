import {useEffect, useState, useRef} from 'react'
import {
    Highlight,
    Index,
    InstantSearch,
  } from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'
import { simple } from 'instantsearch.js/es/lib/stateMappings'
import algoliasearch from 'algoliasearch/lite'
import { useSearchModalContext } from '@/context/SearchModalContext'
import CustomSearchBox from '@/components/Search/CustomSearchBox'
import IconClose from '@/svgs/close.svg'

import { CSSTransition } from 'react-transition-group'
import classes from './SearchModal.module.scss'
import 'instantsearch.css/themes/reset.css'
import 'instantsearch.css/themes/satellite.css'

const SearchModal = () => {
  const searchModalContext = useSearchModalContext()
  const { searchOpen  } = searchModalContext
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

  const searchClient = algoliasearch('9RTKNI42PN', '4876c2b9c59451c3b189e5bd892dfc9f')

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