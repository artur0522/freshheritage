import { createContext, useContext, useState, useReducer, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import ArticleFiltersDrawer from '@/components/Layout/ArticleFiltersDrawer'
import moment from 'moment'

const ArticleFiltersDrawerContext = createContext()

function drawerReducer(state, action) {
  switch (action.type) {
    case 'open_drawer': {
      return {
        ...state,
        isOpen: true,
      }
    }
    case 'close_drawer': {
      return {
        ...state,
        isOpen: false,
      }
    }
    case 'add_tag_count': {
      return {
        ...state,
        tagCount: action.payload
      }
    }
    case 'add_original_listings': {
      return {
        ...state,
        originalListings: action.payload
      }
    }
    case 'add_listings': {
      return {
        ...state,
        listings: action.payload
      }
    }
    case 'add_filters': {
      return {
        ...state,
        filters: action.payload
      }
    }
    case 'add_select_value': {
      return {
        ...state,
        selectValue: action.payload
      }
    }
    case 'add_selected_filters': {
      return {
        ...state,
        selectedFilterList: [...state.selectedFilterList.filter(filter => filter !== action.payload), action.payload]
      }
    }
    case 'remove_selected_filters': {
      return {
        ...state,
        selectedFilterList: [...state.selectedFilterList.filter(filter => filter !== action.payload)]
      }
    }
    case 'toggle_checkbox': {
      if(action.payload.hasSubfilter) {
        return {
          ...state,
          filters: {
            ...state.filters,
            [action.payload.filterGroup]: {
              options: {
                ...state.filters[action.payload.filterGroup].options,
                [action.payload.option]: {
                  checked: state.filters[action.payload.filterGroup].options[action.payload.option].checked,
                  subFilters: {
                    ...state.filters[action.payload.filterGroup].options[action.payload.option].subFilters,
                    [action.payload.subFilter]: {
                      checked: !state.filters[action.payload.filterGroup].options[action.payload.option].subFilters[action.payload.subFilter].checked,
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        return {
          ...state,
          filters: {
            ...state.filters,
            [action.payload.filterGroup]: {
              options: {
                ...state.filters[action.payload.filterGroup].options,
                [action.payload.option]: {
                  checked: !state.filters[action.payload.filterGroup].options[action.payload.option].checked,
                  subFilters: action.payload.subFilters
                },
              }
            }
          }
        }
      }
    }
    default:
      return state;
  }
}







const initialState = {
  isOpen: false,
  filters: {},
  selectedFilterList: [],
  listings: [],
  originalListings: [],
  tagCount: {},
  selectValue: 'newest'
}






export function useArticleFiltersDrawerContext() {
  return useContext(ArticleFiltersDrawerContext)
}






export function ArticleFiltersDrawerProvider({ children }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)
  
  const { isOpen, filters, selectedFilterList, listings, originalListings, tagCount, selectValue} = state

  const openDrawer = () => {
    dispatch({ type: 'open_drawer'})
  }

  const addSelectValue = (value) => {
    dispatch({ type: 'add_select_value', payload: value})
  }

  const addFilters = (filters) => {
    dispatch({ type: 'add_filters', payload: filters})
  }

  const addTagCount = (tagCount) => {
    dispatch({ type: 'add_tag_count', payload: tagCount})
  }

  const addListings = (listings) => {
    dispatch({ type: 'add_listings', payload: listings})
  }

  const addOriginalListings = (listings) => {
    dispatch({ type: 'add_original_listings', payload: listings})
  }

  const filterListingsByTags = (listings) => {
    let res = []

    if(selectedFilterList.length > 0) {
      res = originalListings.filter((listing) => {
        if(listing.fields?.articleTags && selectedFilterList.includes(listing.fields?.articleTags[1]?.value)) {
          return listing
        }
      })
    } else { 
      res = originalListings 
    } 
    
    dispatch({ type: 'add_listings', payload: res})
  }

  const selectChangeHandler = (value) => {
    console.log(value)
    addSelectValue(value)

    if(selectedFilterList.length > 1 && value === 'newest') {
      const sortedListings = listings.sort((a, b) => {
        // let datePublished = moment.unix(listing.createdAt).format('MM/DD/YYYY')
        // if(listing.fields.publishedDate) {
        //   datePublished = moment(listing.fields.publishedDate).format('MM/DD/YYYY')
        // }
        return(
          moment(b.fields.publishedDate).format('MM/DD/YYYY') - moment(a.fields.publishedDate).format('MM/DD/YYYY')
        )
      })
      console.log("sorted", sortedListings)
      dispatch({ type: 'add_listings', payload: sortedListings})
    } 

    if(selectedFilterList.length === 0 && value === 'newest') {
      //  let datePublished = moment.unix(listing.createdAt).format('MM/DD/YYYY')
      //   if(listing.fields.publishedDate) {
      //     datePublished = moment(listing.fields.publishedDate).format('MM/DD/YYYY')
      //   }
      
      const sortedOgListings = originalListings.sort((a, b) =>  {
        return (
          moment(b.fields.publishedDate).format('MM/DD/YYYY') - moment(a.fields.publishedDate).format('MM/DD/YYYY')
        )
      })
      console.log("sortedOgListings", sortedOgListings)
      dispatch({ type: 'add_listings', payload: sortedOgListings})
    }
  }

  const checkBoxHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    if(hasSubfilter) {
      dispatch({ type: 'toggle_checkbox', payload: {
        hasSubfilter,
        filterGroup,
        option: filterOption,
        subFilter: subFilter
      }})

      if(filters[filterGroup].options[filterOption].subFilters[subFilter].checked) { 
        filters[filterGroup].options[filterOption].checked = false 
      }  

      if(filters[filterGroup].options[filterOption].subFilters[subFilter].checked) {
        dispatch({type: 'remove_selected_filters', payload: subFilter})
        filterListingsByTags(listings)
      } else {
        dispatch({type: 'add_selected_filters', payload: subFilter})
        filterListingsByTags(listings)
      }

    } else {
      const nestedSubFilters = filters[filterGroup].options[filterOption].subFilters

      Object.keys(nestedSubFilters).forEach((key) => {
        filters[filterGroup].options[filterOption].subFilters[key].checked = true       
          if(filters[filterGroup].options[filterOption].subFilters[key].checked) {
            dispatch({type: 'add_selected_filters', payload: key})
            filterListingsByTags(listings)
          } else {
            dispatch({type: 'remove_selected_filters', payload: key})
            filterListingsByTags(listings) 
          }
      })

      dispatch({ type: 'toggle_checkbox', payload: {
        hasSubfilter,
        filterGroup,
        option: filterOption,
        subFilters: nestedSubFilters
      }})

      if(filters[filterGroup].options[filterOption].checked) {
        dispatch({type: 'remove_selected_filters', payload: filterOption})
        filterListingsByTags(listings)
      } else {
        dispatch({type: 'add_selected_filters', payload: filterOption})
        filterListingsByTags(listings)
      }
    }
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')

    filterListingsByTags(listings)
  }, [isOpen, selectedFilterList]) 

  useEffect(() => {
    router.beforePopState(({ as }) => {
      dispatch({ type: 'close_drawer' })
      return true
    })
    return () => {
      router.beforePopState(() => true);
    }
  }, [router])

  return (
    <ArticleFiltersDrawerContext.Provider value={{isOpen, selectChangeHandler, addTagCount, tagCount, filters, openDrawer, addFilters, checkBoxHandler, dispatch, selectedFilterList, listings, originalListings, addListings, addOriginalListings}}>
      {isOpen &&
        <ArticleFiltersDrawer  />
      }
      {children}
    </ArticleFiltersDrawerContext.Provider>
  )
}