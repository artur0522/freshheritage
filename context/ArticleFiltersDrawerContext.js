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
    case 'add_filters': {
      return {
        ...state,
        filters: action.payload
      }
    }
    case 'toggle_checkbox': {
      return {
        ...state,
        filters: action.payload
      }
    }
    case 'add_selected_filters': {
      return {
        ...state,
        selectedFilters: action.payload
      }
    }
    default:
      return state;
  }
}

const initialState = {
  isOpen: false,
  filters: [],
  selectedFilters: []
};

export function useArticleFiltersDrawerContext() {
  return useContext(ArticleFiltersDrawerContext)
}

export function ArticleFiltersDrawerProvider({ children }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)
  const [selectedFiltersList, setSelectedFiltersList ] = useState([])
  const { isOpen, filters, selectedFilters } = state

  useEffect(() => {
    dispatch({ type: 'add_selected_filters', payload: selectedFiltersList })
  }, [selectedFiltersList])
  
  const openDrawer = () => {
    dispatch({ type: 'open_drawer'})
  }

  const addFilters = (filters) => {
    dispatch({ type: 'add_filters', payload: filters})
  }
  
  const checkBoxHandler = (inputId, filterGroupTitle, isFilterOption, filterOption) => {
    let newFiltersArray = [...filters]
    let filterIndex
    let foundOptionIndex
    let foundSubFilterIndex

    if(isFilterOption) {
      filterIndex = newFiltersArray.findIndex(filterGroup => filterGroup.title === filterGroupTitle)
      foundOptionIndex = newFiltersArray[filterIndex].filterOptions.findIndex(option => option.value === inputId)
      let foundFilterOption = newFiltersArray[filterIndex].filterOptions[foundOptionIndex]
      
      if(foundFilterOption.isChecked) {
        foundFilterOption.isChecked = false
      } else {
        foundFilterOption.isChecked = true
        setSelectedFiltersList(list => [...list, foundFilterOption.value])
      }

      if(foundFilterOption.subFilters && foundFilterOption.isChecked) {
        foundFilterOption.subFilters.forEach((subFilter) => {
          subFilter.isChecked = true
          setSelectedFiltersList(list => [...list, subFilter.value])
        })
      } else {
        foundFilterOption.subFilters?.forEach(subFilter => subFilter.isChecked = false)
      }
    } else {
      filterIndex = newFiltersArray.findIndex(filterGroup => filterGroup.title === filterGroupTitle)
      foundOptionIndex = newFiltersArray[filterIndex].filterOptions.findIndex(option => option.value === filterOption.value)
      foundSubFilterIndex = newFiltersArray[filterIndex].filterOptions[foundOptionIndex].subFilters.findIndex(subFilter => subFilter.value === inputId)
      let subFilter = newFiltersArray[filterIndex].filterOptions[foundOptionIndex].subFilters[foundSubFilterIndex]

      if(subFilter.isChecked) {
       subFilter.isChecked = false
       filterOption.isChecked = false
      } else {
        subFilter.isChecked = true
        setSelectedFiltersList(list => [...list, subFilter.value])
      }
    }
 
    dispatch({ type: 'toggle_checkbox', payload: newFiltersArray })
  }

  const updateParam = () => {
    if (router.pathname === '/pages/choose-your-plan' && router.isReady) {
      router.replace({
        pathname: '/pages/choose-your-plan',
        query: (activeProductHandle ? { expand: activeProductHandle } : undefined)
      }, undefined, { shallow: true })
    }
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
    updateParam()
  }, [isOpen])

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
    <ArticleFiltersDrawerContext.Provider value={{isOpen, filters, openDrawer, addFilters, checkBoxHandler, dispatch, selectedFilters}}>
      {isOpen &&
        <ArticleFiltersDrawer  />
      }
      {children}
    </ArticleFiltersDrawerContext.Provider>
  )
}