import { createContext, useContext, useReducer, useEffect } from 'react'
import ArticleFiltersDrawer from '@/components/Layout/ArticleFiltersDrawer'

const ArticleFiltersDrawerContext = createContext()

function drawerReducer(state, action) {
  switch (action.type) {
    case 'open_drawer': {
      return {
        ...state,
        isOpen: true,
      };
    }
    case 'close_drawer': {
      return {
        ...state,
        isOpen: false,
      };
    }
    default:
      return state;
  }
}

const initialState = {
  isOpen: false,
};

export function useArticleFiltersDrawerContext() {
  return useContext(ArticleFiltersDrawerContext)
}

export function ArticleFiltersDrawerProvider({ children }) {

  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)
  const { isOpen } = state

  const openDrawer = () => {
    dispatch({ type: 'open_drawer'})
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
    updateParam()
  }, [isOpen])

  useEffect(() => {
   
  }, [])

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
    <ArticleFiltersDrawerContext.Provider value={{isOpen, openDrawer, dispatch}}>
      {isOpen &&
        <ArticleFiltersDrawer  />
      }
      {children}
    </ArticleFiltersDrawerContext.Provider>
  )
}