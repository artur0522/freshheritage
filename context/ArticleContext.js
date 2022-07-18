import { createContext, useContext, useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Router from 'next/router'

const ArticleContext = createContext()

export function useArticleContext() {
  return useContext(ArticleContext)
}

export function ArticleProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (isSidebarOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isSidebarOpen) document.querySelector('html').classList.remove('disable-scroll')
  }, [isSidebarOpen])

  useEffect(() => {
    const onRountChangeComplete = () => {
      setIsSidebarOpen(false)
    }
    Router.events.on('routeChangeComplete', onRountChangeComplete)
  }, [])

  return (
    <ArticleContext.Provider value={{isSidebarOpen, setIsSidebarOpen}}>
      {children}
    </ArticleContext.Provider>
  )
}