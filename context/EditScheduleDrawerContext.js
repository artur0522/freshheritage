import { createContext, useContext, useReducer, useEffect } from 'react'
import EditScheduleDrawer from '@/components/Account/EditScheduleDrawer/EditScheduleDrawer'
import { useRouter } from 'next/router'

const EditScheduleDrawerContext = createContext()

function drawerReducer(state, action) {
  switch (action.type) {
    case 'open_drawer': {
      return {
        ...state,
        isOpen: true,
        subscription: action.payload
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
  subscription: null,
};

export function useEditScheduleDrawerContext() {
  return useContext(EditScheduleDrawerContext)
}

export function EditScheduleDrawerProvider({ children }) {

  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)
  const { isOpen, subscription } = state

  const openDrawer = (subscription) => {
    dispatch({ type: 'open_drawer', payload: subscription})
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
  }, [isOpen])

  useEffect(() => {
    dispatch({ type: 'close_drawer' })
  }, [router])

  return (
    <EditScheduleDrawerContext.Provider value={{isOpen, openDrawer, dispatch}}>
      {isOpen &&
        <EditScheduleDrawer subscription={subscription} />
      }
      {children}
    </EditScheduleDrawerContext.Provider>
  )
}
