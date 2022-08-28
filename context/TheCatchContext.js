import { createContext, useContext, useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import TheCatchDrawer from '@/components/Layout/TheCatchDrawer/TheCatchDrawer'

const TheCatchContext = createContext()

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
    case 'add_issue': {
        return {
          ...state, 
          currentIssue: action.payload,
        }
    }
    case 'add_past_issues': {
      return {
        ...state, 
        pastIssues: action.payload,
      }
    }
    case 'add_filtered_issue': {
        return {
          ...state, 
          filteredIssue: action.payload,
        }
    }
    default:
      return state
  }
}

const initialState = {
  isOpen: false,
  currentIssue: {},
  filteredIssue: {},
  pastIssues: []
}

export function useTheCatchContext() {
  return useContext(TheCatchContext)
}

export function TheCatchProvider({ children }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)
  const { currentIssue, isOpen, filteredIssue, pastIssues } = state

  const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
  const date = new Date()
  const monthName = month[date.getMonth()]
  const year = date.getFullYear()

  const openDrawer = () => {
    dispatch({ type: 'open_drawer'})
  }

  const closeDrawer = () => {
    dispatch({ type: 'close_drawer'})
  }

  const addIssue = (currentIssue) => {
    dispatch({ type: 'add_issue', payload: currentIssue})
  }

  const addFilteredIssue = (issue) => {
    dispatch({ type: 'add_filtered_issue', payload: issue})
  }

  const addPastIssues = (issues) => {
    dispatch({ type: 'add_past_issues', payload: issues})
  }

  useEffect(() => {
    const onRountChangeComplete = () => {
      closeDrawer()
    }
    router.events.on('routeChangeComplete', onRountChangeComplete)
  }, [router.pathname])

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
  }, [isOpen, filteredIssue])

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
    <TheCatchContext.Provider value={{isOpen, openDrawer, closeDrawer, addFilteredIssue, addPastIssues, pastIssues, filteredIssue, addIssue, currentIssue, monthName, year, dispatch}}>
      {isOpen &&
        <TheCatchDrawer  />
      }
      {children}
    </TheCatchContext.Provider>
  )
}