import { createContext, useContext, useState, useEffect } from 'react'
import Modal from '@/components/Layout/Modal'
import Router, { useRouter } from 'next/router'

const ModalContext = createContext()

export function useModalContext() {
  return useContext(ModalContext)
}

export function ModalProvider({ children }) {
  const [productCustomerTag, setProductCustomerTag] = useState(false)
  const [articleCustomerTag, setArticleCustomerTag] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [prevContent, setPrevContent] = useState('')
  const [modalType, setModalType] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')

  }, [isOpen, content])

  useEffect(() => {
    const onRountChangeComplete = () => {
      if(router.pathname !== '/products/[handle]' && router.pathname !== 'blogs/brand/[category]/[handle]' && router.pathname !== 'blogs/culinary/[category]/[handle]') {
        setIsOpen(false)
      }
     
      if(router.pathname === '/products/[handle]' && prevContent && !productCustomerTag) {
        // setIsOpen(true)
        document.querySelector('html').classList.add('disable-scroll')
      }

      // if(router.pathname !== 'blogs/brand/[category]/[handle]' && router.pathname !== '/products/[handle]' && prevContent && !articleCustomerTag) {
      //   setIsOpen(false)
      // }

      if(router.pathname === 'blogs/brand/[category]/[handle]' && prevContent && !articleCustomerTag) {
        setIsOpen(true)
        document.querySelector('html').classList.add('disable-scroll')
      }

      // if(router.pathname !== 'blogs/culinary/[category]/[handle]' && router.pathname !== '/products/[handle]' && prevContent && !articleCustomerTag) {
      //   setIsOpen(false)
      // }

      if(router.pathname === 'blogs/culinary/[category]/[handle]' && router.pathname !== '/products/[handle]' && prevContent && !articleCustomerTag) {
        setIsOpen(true)
        document.querySelector('html').classList.add('disable-scroll')
      }
    }
    Router.events.on('routeChangeComplete', onRountChangeComplete)
  }, [router.pathname])

  return (
    <ModalContext.Provider value={{setArticleCustomerTag, setProductCustomerTag, prevContent, setPrevContent, isOpen, setIsOpen, content, setContent, modalType, setModalType}}>
      {isOpen &&
        <Modal children={content} />
      }
      {children}
    </ModalContext.Provider>
  )
}