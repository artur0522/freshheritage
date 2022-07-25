import { createContext, useContext, useState, useReducer, useEffect, useCallback } from 'react'
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
  const { currentIssue, isOpen, filteredIssue } = state

  const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
  const date = new Date()
  const monthName = month[date.getMonth()]

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

  const findIssue = (month) => {
    const filtered = currentIssue.fields?.content?.filter(content => content._type === 'staticHarvest')
    const found = filtered.find(staticHarvest => staticHarvest.harvestMonth[0].month === month)

    addFilteredIssue(found)
    closeDrawer()
  }

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
    <TheCatchContext.Provider value={{isOpen, openDrawer, closeDrawer, addFilteredIssue, filteredIssue, addIssue, findIssue, currentIssue, monthName, dispatch}}>
      {isOpen &&
        <TheCatchDrawer  />
      }
      {children}
    </TheCatchContext.Provider>
  )
}