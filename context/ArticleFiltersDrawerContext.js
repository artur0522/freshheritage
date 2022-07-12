import { createContext, useContext, useState, useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import ArticleFiltersDrawer from '@/components/Layout/ArticleFiltersDrawer'
import { filter } from 'lodash-es'

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
  listings: []
};

export function useArticleFiltersDrawerContext() {
  return useContext(ArticleFiltersDrawerContext)
}

export function ArticleFiltersDrawerProvider({ children }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)
  const { isOpen, filters, selectedFilterList, listings } = state

  const openDrawer = () => {
    dispatch({ type: 'open_drawer'})
  }

  const addFilters = (filters) => {
    dispatch({ type: 'add_filters', payload: filters})
  }

  const addListings = (listings) => {
    dispatch({ type: 'add_listings', payload: listings})
  }
  
  const checkBoxHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    if(hasSubfilter) {
      dispatch({ type: 'toggle_checkbox', payload: {
        hasSubfilter,
        filterGroup,
        option: filterOption,
        subFilter: subFilter
      }})
      // conditional
      if(filters[filterGroup].options[filterOption].subFilters[subFilter].checked) {
        dispatch({type: 'remove_selected_filters', payload: subFilter})
      } else {
        dispatch({type: 'add_selected_filters', payload: subFilter})
      }
      
      console.log(selectedFilterList)
    } else {
      const nestedSubFilters = filters[filterGroup].options[filterOption].subFilters

      Object.keys(nestedSubFilters).forEach((key) => {
        console.log(key)
        filters[filterGroup].options[filterOption].subFilters[key].checked = !filters[filterGroup].options[filterOption].subFilters[key].checked
        // conditional
        if(filters[filterGroup].options[filterOption].subFilters[key].checked) {
          dispatch({type: 'add_selected_filters', payload: key})
          console.log(selectedFilterList)
        } else {
          dispatch({type: 'remove_selected_filters', payload: key})
          console.log(selectedFilterList)
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
      } else {
        dispatch({type: 'add_selected_filters', payload: filterOption})
      }
    }
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
    console.log('selectedfilterlist', selectedFilterList)
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
    <ArticleFiltersDrawerContext.Provider value={{isOpen, filters, openDrawer, addFilters, checkBoxHandler, dispatch, selectedFilterList, listings, addListings}}>
      {isOpen &&
        <ArticleFiltersDrawer  />
      }
      {children}
    </ArticleFiltersDrawerContext.Provider>
  )
}