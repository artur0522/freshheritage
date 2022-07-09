import { createContext, useContext, useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import ArticleFiltersDrawer from '@/components/Layout/ArticleFiltersDrawer'

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
        ...state
      }
    }
    default:
      return state;
  }
}

const initialState = {
  isOpen: false,
  filters: []
};

export function useArticleFiltersDrawerContext() {
  return useContext(ArticleFiltersDrawerContext)
}

export function ArticleFiltersDrawerProvider({ children }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)
  const { isOpen, filters } = state
  
  const openDrawer = () => {
    dispatch({ type: 'open_drawer'})
  }

  const addFilters = (filters) => {
    dispatch({ type: 'add_filters', payload: filters})
  }

  const checkBoxHandler = (inputId) => {
    console.log('inputhandler', inputId)
    dispatch({ type: 'toggle_checkbox', payload: inputId })
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
    <ArticleFiltersDrawerContext.Provider value={{isOpen, filters, openDrawer, addFilters, checkBoxHandler, dispatch}}>
      {isOpen &&
        <ArticleFiltersDrawer  />
      }
      {children}
    </ArticleFiltersDrawerContext.Provider>
  )
}