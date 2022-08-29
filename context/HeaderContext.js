import { createContext, useContext, useState, useEffect, useRef } from 'react'
import Header from '@/components/Layout/Header'
import Router from 'next/router'
const HeaderContext = createContext()
import * as Cookies from 'es-cookie'

export function useHeaderContext() {
  return useContext(HeaderContext)
}

export function HeaderProvider({ children, content, pageHandle }) {

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false)
  const [showAnnoucementBar, setShowAnnoucementBar] = useState(false)
  const [hide, setHide] = useState(false)
  const headerRef = useRef()
  const oldScrollYPosition = useRef(0)

  const removeAnnoucementBar = () => {
    setShowAnnoucementBar(!showAnnoucementBar)
    Cookies.set('hidePrimaryAnnoucement', 'true', { expires: 1, path: '/' })
  }

  const stickyNavbar = () => {
    if (window !== undefined) {
      if (window.scrollY > oldScrollYPosition.current + 250) {
        setHide(true)
        oldScrollYPosition.current = window.scrollY
      } else if (window.scrollY < oldScrollYPosition.current) {
        setHide(false)
        oldScrollYPosition.current = window.scrollY
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', stickyNavbar)
    return () => {
      window.removeEventListener('scroll', stickyNavbar)
    }
  }, [])

  useEffect(() => {
    if (hide) document.querySelector('html').classList.add('nav-is-hidden')
    if (!hide) document.querySelector('html').classList.remove('nav-is-hidden')
  }, [hide])

  useEffect(() => {
    const hidePrimaryAnnoucement = Cookies.get('hidePrimaryAnnoucement')
    setShowAnnoucementBar(hidePrimaryAnnoucement == 'true' ? false : true)
  }, []);

  useEffect(() => {
    const onRountChangeComplete = () => {
      setMobileMenuIsOpen(false)
    };
    Router.events.on('routeChangeComplete', onRountChangeComplete);
  }, [])

  if (!content) {
    return ''
  }

  return (
    <HeaderContext.Provider value={{mobileMenuIsOpen, setMobileMenuIsOpen, hide, setHide, showAnnoucementBar, setShowAnnoucementBar, removeAnnoucementBar, headerRef}}>
      <Header ref={headerRef} content={content} pageHandle={pageHandle} />
      {children}
    </HeaderContext.Provider>
  )
}
