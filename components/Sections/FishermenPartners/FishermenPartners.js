import {useState, useEffect} from 'react'

import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'
import FishermenFilters from './FishermenFilters'
import FishermenCard from '@/components/Cards/FishermenCard/FishermenCard'
import ResponsiveImage from "@/components/ResponsiveImage"

import classes from "./FishermenPartners.module.scss"

const FishermenPartners = ({ fields }) => {
  const [filterDrawer, toggleFilterDrawer]= useState(true)
  const { filterGroups, illustration, header, fishermen, calloutHeader, calloutSubheader, topPadding, bottomPadding } = fields
  const drawerContext = useArticleFiltersDrawerContext()
  const { addFilters, setIsFishermen, openDrawer, isOpen, selectChangeHandler, selectedFilterList, addListings, addTagArray, addOriginalListings, listings, addTagCount} = drawerContext

  useEffect(() => {
    setIsFishermen()
    addListings(fishermen)
    addOriginalListings(fishermen)

    const tagCount = {}
    const tagArray = []
    fishermen?.forEach((fisherman) => {
        fisherman.species?.forEach((tag) => {
        if(!tagCount[tag.title.toLowerCase()]) {
            tagCount[tag.title.toLowerCase()] = 1
        }

        if(tagCount[tag.title.toLowerCase()]) {
            tagCount[tag.title.toLowerCase()]++
        }

        tagArray.push(tag.title.toLowerCase())
        })
    })
    
    addTagArray(tagArray)
    addTagCount(tagCount)

    const filterGroupObj = {}
    filterGroups?.map((group) => {
      filterGroupObj[group.title.toLowerCase()] = {
        options: {}
      }

      group.filterOptions?.map((option) => {
          filterGroupObj[group.title.toLowerCase()].options[option.value.toLowerCase()] = {
            checked: false,
            subFilters: {}
          }

          if(option.subFilters) {
            option.subFilters.map((subFilter) => {
                filterGroupObj[group.title.toLowerCase()].options[option.value.toLowerCase()].subFilters[subFilter.value.toLowerCase()] = {
                checked: false
                }
            })
          }
      })
    })

    addFilters(filterGroupObj)
  }, [])

  const openFiltersDrawer = () => {
    setIsFishermen()
    openDrawer()
  }

  return (
    <div className={`${classes['fishermen']} ${topPadding ? classes['top-padding'] : ''} ${bottomPadding ? classes['bottom-padding'] : ''}`}>
         {calloutHeader && <div className={`${classes['row']} container`}>
            <div className={classes['col']}>
            </div>
            <div className={classes['col']}>
                <div className={classes['callout']}>
                    {calloutHeader && <h4>{calloutHeader}</h4>}
                    {calloutSubheader && <p>{calloutSubheader}</p>}
                </div>
            </div>
        </div>}

        <div className={classes['illustration-wrap']}>
            {illustration && <div className={classes['illustration']}>
                <ResponsiveImage
                    src={illustration.asset.url}
                    layout="fill"
                    alt='illustration'
                />
            </div>}
        </div>

        <div className={classes['fishermen-wrap']}>
            <form className={`${classes['filter-wrap']} container`}>
                {header && <h1>{header}</h1>}
                <div className={classes['recipes__filter-row']}>
                    {filterGroups && filterGroups?.length > 0 && <button onClick={() => toggleFilterDrawer(!filterDrawer)} type="button" className={`${classes['toggle-filters']} ${classes['desktop']}`}>
                    {filterDrawer ? <span className="body">Hide Filters</span> : <span className="body">Show Filters</span>}
                    </button>}

                    {filterGroups && filterGroups?.length > 0 && <button onClick={() => openFiltersDrawer()} type="button" className={`${classes['toggle-filters']} ${classes['mobile']}`}>
                    {isOpen ? <span className="body">Hide Filters</span> : <span className="body">Show Filters</span>}
                    </button>}

                    <div className={classes['sort-by']}>
                    <label className="body">Sort By</label>
                    <select className="body" onChange={(e) => selectChangeHandler(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                    </div>
                </div>
            </form>

            <div className={`${classes['filters-list__wrap']} ${filterDrawer ? 'open' : 'close'}`}>
                {filterDrawer && filterGroups?.length > 0 && <div className={`${classes['filters']}`}>
                    <FishermenFilters />
                </div>}

                <div className={`${classes['recipes__list-wrap']} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']}`}>
                    {listings.length > 0 && selectedFilterList.length > 0 && <div className={`${classes['recipes__list']} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']} container`}>
                        {listings.map((article) => {
                            console.log(article)
                            return (
                                <div className={classes['grid-item']} key={article._id}>
                                    <FishermenCard article={article} />
                                </div>
                            )
                        })}
                    </div>}

                    {fishermen.length > 0 && selectedFilterList.length === 0 && <div className={`${classes['recipes__list']} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']} container`}>
                        {fishermen.map((article) => {
                            return (
                            <div className={classes['grid-item']} key={article._id}>
                                 <FishermenCard article={article} />
                            </div>
                            )
                        })}
                    </div>}
                </div>
            </div>
        </div>
    </div>
  )
}

export default FishermenPartners