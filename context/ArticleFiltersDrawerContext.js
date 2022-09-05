import { createContext, useContext, useReducer, useEffect} from 'react'
import { useRouter } from 'next/router'
import ArticleFiltersDrawer from '@/components/Layout/ArticleFiltersDrawer'
import FishermenInfoDrawer from '@/components/Layout/FishermenInfoDrawer/FishermenInfoDrawer'
import moment from 'moment'
import { filter, groupBy } from 'lodash-es'

const ArticleFiltersDrawerContext = createContext()

function drawerReducer(state, action) {
  switch (action.type) {
    case 'set_current_filter_group': {
      return {
        ...state,
        currentFilterGroup: action.payload
      }
    }
    case 'set_current_option': {
      return {
        ...state,
        currentOption: action.payload
      }
    }
    case 'set_info_card': {
      return {
        ...state,
        infoCardFields: action.payload
      }
    }
    case 'is_fishermen': {
      return {
        ...state,
        isFishermen: true,
      }
    }
    case 'open_fish_info': {
      return {
        ...state,
        isFishInfoOpen: true
      }
    }
    case 'close_fish_info': {
      return {
        ...state,
        isFishInfoOpen: false
      }
    }
    case 'open_drawer': {
      return {
        ...state,
        isOpen: true
      }
    }
    case 'close_drawer': {
      return {
        ...state,
        isOpen: false
      }
    }
    case 'add_url': {
      return {
        ...state,
        newUrl: action.payload
      }
    }
    case 'add_tag_count': {
      return {
        ...state,
        tagCount: action.payload
      }
    }
    case 'add_tag_array': {
      return {
        ...state,
        tagArray: action.payload
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
    case 'add_selected_filtergroup': {
      return {
        ...state,
        selectedFilterGroups: [...state.selectedFilterGroups, action.payload]
      }
    }
    case 'remove_selected_filtergroup_by_option': {
      return {
        ...state,
        selectedFilterGroups: [...state.selectedFilterGroups.filter((group) => {
          group.filterOption !== action.payload.filterOption
        })]
      }
    }
    case 'remove_selected_filtergroup_by_subfilter': {
      return {
        ...state,
        selectedFilterGroups: [...state.selectedFilterGroups.filter((group) => {
          group.subFilter !== action.payload.subFilter
        })]
      }
    }
    case 'replace_selected_filters': {
      return {
        ...state,
        selectedFilterList: action.payload
      }
    }
    case 'add_selected_filters': {
      return {
        ...state,
        selectedFilterList: [...state.selectedFilterList.filter(filter => filter !== action.payload), action.payload],
      }
    }
    case 'remove_selected_filters': {
      return {
        ...state,
        selectedFilterList: [...state.selectedFilterList.filter(filter => filter !== action.payload)],
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
      return state
  }
}

const initialState = {
  isOpen: false,
  isFishermen: false,
  filters: {},
  selectedFilterList: [],
  selectedFilterGroups: [],
  listings: [],
  originalListings: [],
  tagCount: {},
  tagArray: [],
  selectValue: 'newest',
  infoCardFields: {},
  isFishInfoOpen: false,
  currentOption: null,
  currentFilterGroup: null,
  newUrl: null
}

export function useArticleFiltersDrawerContext() {
  return useContext(ArticleFiltersDrawerContext)
}

export function ArticleFiltersDrawerProvider({ children }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)

  const { newUrl, currentOption, currentFilterGroup, isOpen, infoCardFields, isFishInfoOpen, filters, selectedFilterList, selectedFilterGroups, listings, originalListings, tagCount, tagArray, isFishermen} = state

  const replaceSelectedFilters = (list) => {
    dispatch({type: 'replace_selected_filters', payload: list})
  }
  
  const setCurrentOption = (currentOption) => {
    dispatch({type: 'set_current_option', payload: currentOption})
  }

  const setCurrentFilterGroup = (currentFilterGroup) => {
    dispatch({type: 'set_current_filter_group', payload: currentFilterGroup})
  }

  const setIsFishermen = () => {
    dispatch({type: 'is_fishermen'})
  }

  const openDrawer = () => {
    dispatch({ type: 'open_drawer'})
  }

  const openFishInfo = () => {
    dispatch({ type: 'open_fish_info'})
  }

  const closeDrawer = () => {
    dispatch({ type: 'close_drawer'})
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

  const addTagArray = (tags) => {
    dispatch({ type: 'add_tag_array', payload: tags})
  }

  const addListings = (listings) => {
    dispatch({ type: 'add_listings', payload: listings})
  }

  const addOriginalListings = (listings) => {
    dispatch({ type: 'add_original_listings', payload: listings})
  }
  
  const setInfoCard = (info) => {
    dispatch({ type: 'set_info_card', payload: info})
  }

  const addUrl = (url) => {
    dispatch({ type: 'add_url', payload: url})
  }

  const sortListings = (listings, mostRecent) => {
    const sortedListings = listings.sort((a, b) => {
      let aPublishedDate = a.fields ? moment(a.fields.createdAt).unix() : moment(a.createdAt).unix()
      let bPublishedDate = b.fields ? moment(b.fields.createdAt).unix() : moment(b.createdAt).unix()
      if (a.fields?.publishedDate) {
        aPublishedDate = moment(a.fields.publishedDate).unix()
      }
      if (a.publishedDate) {
        aPublishedDate = moment(a.publishedDate).unix()
      }
      if (b.fields?.publishedDate) {
        bPublishedDate = moment(b.fields.publishedDate).unix()
      }
      if (b.publishedDate) {
        bPublishedDate = moment(b.publishedDate).unix()
      }
      return (mostRecent) ?  bPublishedDate - aPublishedDate : aPublishedDate - bPublishedDate
    })
    dispatch({ type: 'add_listings', payload: sortedListings})
  }

  const checkboxHandler  = (hasSubfilter, filterGroup, option, subFilter, subFilters) => {
    if(!hasSubfilter || subFilter) {
      dispatch({ type: 'toggle_checkbox', payload: {
        hasSubfilter,
        filterGroup,
        option: option,
        subFilter: subFilter,
        subFilters: subFilters
      }})
    }

    let refinedUrl;
   
    if(!hasSubfilter && !subFilter && !newUrl) {
      refinedUrl = `${filterGroup}=${option}`

      dispatch({ type: 'add_url', payload: refinedUrl})

      router.replace({
        pathname: `/blogs/culinary/${router.query.category}` || `/blogs/stories/${router.query.category}`,
        query: {
          filters: decodeURI(refinedUrl)
        }
      },
      undefined, { shallow: true })
    }

    if(hasSubfilter && !subFilter && !newUrl) {
      refinedUrl = `${filterGroup}=${option}`

      dispatch({ type: 'add_url', payload: refinedUrl})

      router.replace({
        pathname: `/blogs/culinary/${router.query.category}` || `/blogs/stories/${router.query.category}`,
        query: {
          filters: decodeURI(refinedUrl)
        }
      },
      undefined, { shallow: true })
    }

    if(subFilter && !newUrl) {
      refinedUrl = `${filterGroup}=${option}=${subFilter}`

      dispatch({ type: 'add_url', payload: refinedUrl})

      router.replace({
        pathname: `/blogs/culinary/${router.query.category}` || `/blogs/stories/${router.query.category}`,
        query: {
          filters: decodeURI(refinedUrl)
        }
      },
      undefined, { shallow: true })
    }

    // IF OPTION WITHOUT A SUBFILTER IS CLICKED
    if(!hasSubfilter && newUrl) {
      if(newUrl.includes(option) && newUrl.includes('&')) {
        refinedUrl = newUrl.replace(`&${filterGroup}=${option}`, '')

      } else if(newUrl.includes(option)) {
        refinedUrl = newUrl.replace(`${filterGroup}=${option}`, '')
      } else {
        refinedUrl = `${newUrl}&${filterGroup}=${option}`
      }

      dispatch({ type: 'add_url', payload: refinedUrl})

      router.replace({
        pathname: `/blogs/culinary/${router.query.category}` || `/blogs/stories/${router.query.category}`,
        query: {
          filters: decodeURI(refinedUrl)
        }
      },
      undefined, { shallow: true })
    }

    // ALL FILTER : IF OPTION WITH A SUBFILTER IS CLICKED
    if(hasSubfilter && !subFilter && newUrl) {
      if(newUrl.includes(option) && newUrl.includes('&')) {
        refinedUrl = newUrl.replace(`&${filterGroup}=${option}`, '')
      } else if(newUrl.includes(option)) {
        refinedUrl = newUrl.replace(`${filterGroup}=${option}`, '')
      } else {
        refinedUrl = `${newUrl}&${filterGroup}=${option}`
      }

      dispatch({ type: 'add_url', payload: refinedUrl})

      router.replace({
        pathname: `/blogs/culinary/${router.query.category}` || `/blogs/stories/${router.query.category}`,
        query: {
          filters: decodeURI(refinedUrl)
        }
      },
      undefined, { shallow: true })
    }

    // SUBFILTER CLICKED
    if(hasSubfilter && subFilter && newUrl) {
      if(newUrl.includes(subFilter) && newUrl.includes('&')) {
        refinedUrl = newUrl.replace(`&${filterGroup}=${option}=${subFilter}`, '')
      } else if(newUrl.includes(subFilter)) {
        refinedUrl = newUrl.replace(`${filterGroup}=${option}=${subFilter}`, '')
      } else {
        refinedUrl = `${newUrl}&${filterGroup}=${option}=${subFilter}`
      }

      dispatch({ type: 'add_url', payload: refinedUrl})

      router.replace({
        pathname: `/blogs/culinary/${router.query.category}` || `/blogs/stories/${router.query.category}`,
        query: {
          filters: decodeURI(refinedUrl)
        }
      },
      undefined, { shallow: true })
    }  
  }

  const selectChangeHandler = (value) => {
    addSelectValue(value)

    if(selectedFilterList.length > 0 && value === 'newest') {
    sortListings(listings, true)
    }

    if(selectedFilterList.length > 0 && value === 'oldest') {
      sortListings(listings, false)
    }

    if(selectedFilterList.length === 0 && value === 'newest') {
      sortListings(originalListings, true)
    }

    if(selectedFilterList.length === 0 && value === 'oldest') {
      sortListings(originalListings, false)
    }
  }

  // FILTER LISTINGS BY TAGS
  const filterListingsByTags = (filterGroup = null, filterOption = null, subFilter = null) => {
    let res = []
    const filteredArray = tagArray.filter((tag) => {
      return selectedFilterList.includes(tag)
    })

    if(selectedFilterList.length > 0) {
      res = originalListings.filter((listing) => {
        return listing.fields?.articleTags?.some(tag => filteredArray.includes(tag.value.toLowerCase()))
      })
    } else {
      res = originalListings
    }

    dispatch({ type: 'add_listings', payload: res})
  }

  // SUBOPTION HANDLER
  const subOptionHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    filters[filterGroup].options[filterOption].checked = false

    checkboxHandler(hasSubfilter, filterGroup, filterOption, subFilter, null)
    setCurrentOption(filterOption)
    setCurrentFilterGroup(filterGroup)

    if(filters[filterGroup].options[filterOption].subFilters[subFilter].checked) {
      dispatch({type: 'remove_selected_filters', payload: subFilter})

      dispatch({type: 'remove_selected_filtergroup_by_subfilter', payload: {
        hasSubfilter,
        filterGroup: filterGroup,
        filterOption: filterOption,
        subFilter: subFilter
      }})

      filterListingsByTags(filterGroup, filterOption, subFilter)
    } else {
      dispatch({type: 'add_selected_filters', payload: subFilter})

      dispatch({type: 'add_selected_filtergroup', payload: {
        hasSubfilter,
        filterGroup: filterGroup,
        filterOption: filterOption,
        subFilter: subFilter
      }})

      filterListingsByTags(filterGroup, filterOption, subFilter)
    }
  }

  // OPTION HANDLER
  const optionHandler = (hasSubfilter, filterGroup, filterOption) => {
    if(hasSubfilter) {
      filters[filterGroup].options[filterOption].checked = !filters[filterGroup].options[filterOption].checked
      dispatch({type: 'remove_selected_filters', payload: filters[filterGroup].options[filterOption]})

      dispatch({type: 'remove_selected_filtergroup_by_option', payload: {
        hasSubfilter,
        filterGroup: filterGroup,
        filterOption: filterOption,
        subFilter: null
      }})
      
      const nestedSubFilters = filters[filterGroup].options[filterOption].subFilters

      if(nestedSubFilters) {
        Object.keys(nestedSubFilters).map((key) => {
          if(filters[filterGroup].options[filterOption].checked) {
            filters[filterGroup].options[filterOption].subFilters[key].checked = true
          } else {
            filters[filterGroup].options[filterOption].subFilters[key].checked = false
          }

          if(filters[filterGroup].options[filterOption].subFilters[key].checked) {
            dispatch({type: 'add_selected_filters', payload: key})

            dispatch({type: 'add_selected_filtergroup', payload: {
              hasSubfilter,
              filterGroup: filterGroup,
              filterOption: filterOption,
              subFilter: null
            }})

            filterListingsByTags(filterGroup, filterOption, null)
          } else {
            dispatch({type: 'remove_selected_filters', payload: key})

            dispatch({type: 'remove_selected_filtergroup_by_option', payload: {
              hasSubfilter,
              filterGroup: filterGroup,
              filterOption: filterOption,
              subFilter: null
            }})

            filterListingsByTags(filterGroup, filterOption)
          }
        })
        checkboxHandler(hasSubfilter, filterGroup, filterOption, null)
      }
    } else {
      const nestedSubFilters = filters[filterGroup].options[filterOption].subFilters

      Object.keys(nestedSubFilters).map((key) => {
        if(tagCount[key] >= 3) {
          filters[filterGroup].options[filterOption].subFilters[key].checked = true
        }

        if(filters[filterGroup].options[filterOption].subFilters[key].checked) {
          dispatch({type: 'add_selected_filters', payload: key})

          dispatch({type: 'add_selected_filtergroup', payload: {
            hasSubfilter,
            filterGroup: filterGroup,
            filterOption: filterOption,
            subFilter: null
          }})

          filterListingsByTags(filterGroup, filterOption, null)
        } else {
          dispatch({type: 'remove_selected_filters', payload: key})

          dispatch({type: 'remove_selected_filtergroup_by_option', payload: {
            hasSubfilter,
            filterGroup: filterGroup,
            filterOption: filterOption,
            subFilter: null
          }})

          filterListingsByTags(filterGroup, filterOption, null)
        }
      })
      
      checkboxHandler(hasSubfilter, filterGroup, filterOption, null, nestedSubFilters)

      if(filters[filterGroup].options[filterOption].checked) {
        dispatch({type: 'remove_selected_filters', payload: filterOption})

        dispatch({type: 'remove_selected_filtergroup_by_option', payload: {
          hasSubfilter,
          filterGroup: filterGroup,
          filterOption: filterOption,
          subFilter: null
        }})

        filterListingsByTags(filterGroup, filterOption, null)
      } else {
        dispatch({type: 'add_selected_filters', payload: filterOption})
        dispatch({type: 'add_selected_filtergroup', payload: {
          hasSubfilter,
          filterGroup: filterGroup,
          filterOption: filterOption,
          subFilter: null
        }})

        filterListingsByTags(filterGroup, filterOption, null)
      }
    }
  }

  useEffect(() => {
    filterListingsByTags()
    
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')

    if (isFishInfoOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isFishInfoOpen) document.querySelector('html').classList.remove('disable-scroll')

    const handleResize = () => {
      if (window.innerWidth >= 1074) {
        dispatch({ type: 'close_drawer'})
        if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
      }
      if(window.innerWidth < 1074 && isOpen) {
        dispatch({ type: 'open_drawer'})
      }
    }

    window.addEventListener('resize', handleResize)

    const newFilters = filters
    const nestedSubFilters = newFilters[currentFilterGroup]?.options[currentOption]?.subFilters
    if(nestedSubFilters) {
      const subFilterArray = Object.keys(nestedSubFilters)?.map(key => nestedSubFilters[key])
      const allSubFiltersChecked = subFilterArray.every((subFilter => subFilter.checked == true))

      if(allSubFiltersChecked) {
        newFilters[currentFilterGroup].options[currentOption].checked = true
        addFilters(newFilters)
       }
    }
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, selectedFilterList, selectedFilterGroups, filters, isFishInfoOpen])

  useEffect(() => {
    router.beforePopState(({ as }) => {
      dispatch({ type: 'close_drawer' })
      return true
    })
    return () => {
      router.beforePopState(() => true)
    }
  }, [router])

  return (
    <ArticleFiltersDrawerContext.Provider value={{ replaceSelectedFilters, addUrl, isOpen, openFishInfo, isFishInfoOpen, setInfoCard, infoCardFields, setIsFishermen, isFishermen, selectChangeHandler, addTagCount, addTagArray, tagCount, filters, filterListingsByTags, openDrawer, closeDrawer, addFilters, optionHandler, subOptionHandler, dispatch, selectedFilterList, listings, originalListings, addListings, addOriginalListings, sortListings}}>
      {isOpen &&
        <ArticleFiltersDrawer />
      }
      {isFishInfoOpen &&
        <FishermenInfoDrawer />
      }
      {children}
    </ArticleFiltersDrawerContext.Provider>
  )
}