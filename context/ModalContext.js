import { createContext, useContext, useState, useEffect } from 'react'
import Modal from '@/components/Layout/Modal'
import Router from 'next/router'

const ModalContext = createContext()

export function useModalContext() {
  return useContext(ModalContext)
}

export function ModalProvider({ children }) {

  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [modalType, setModalType] = useState(null)

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
    console.log(isOpen)
  }, [isOpen, content])

  useEffect(() => {
    const onRountChangeComplete = () => {
      setIsOpen(false)
    }
    Router.events.on('routeChangeComplete', onRountChangeComplete)
  }, [])

  return (
    <ModalContext.Provider value={{isOpen, setIsOpen, content, setContent, modalType, setModalType}}>
      {isOpen &&
        <Modal children={content} />
      }
      {children}
    </ModalContext.Provider>
  )
}