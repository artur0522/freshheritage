import { createContext, useContext, useReducer, useEffect } from 'react'
import KnowYourFishDrawer from '@/components/Layout/KnowYourFishDrawer'
import { useRouter } from 'next/router'

const KnowYourFishDrawerContext = createContext()

function drawerReducer(state, action) {
  switch (action.type) {
    case 'open_drawer': {
      return {
        ...state,
        isOpen: true,
        knowYourFishDetails: action.payload
      };
    }
    case 'close_drawer': {
      return {
        ...state,
        isOpen: false,
        activeProductHandle: null
      };
    }
    case 'add_box_data': {
      return {
        ...state,
        boxManager: action.payload
      };
    }
    default:
      return state;
  }
}

const initialState = {
  isOpen: false,
  knowYourFishDetails: {},
};

export function useKnowYourFishDrawerContext() {
  return useContext(KnowYourFishDrawerContext)
}

export function KnowYourFishDrawerProvider({ children }) {

  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)
  const { isOpen, knowYourFishDetails } = state

  const openDrawer = ({fields}) => {
    dispatch({ type: 'open_drawer', payload: fields})
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
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
    <KnowYourFishDrawerContext.Provider value={{isOpen, openDrawer, dispatch}}>
      {isOpen &&
        <KnowYourFishDrawer fields={knowYourFishDetails} />
      }
      {children}
    </KnowYourFishDrawerContext.Provider>
  )
}