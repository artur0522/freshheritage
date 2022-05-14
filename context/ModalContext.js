import { createContext, useContext, useState, useEffect } from 'react'
import Modal from '@/components/Layout/Modal';

const ModalContext = createContext()

export function useModalContext() {
  return useContext(ModalContext)
}

export function ModalProvider({ children }) {

  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{isOpen, setIsOpen, content, setContent, modalType, setModalType}}>
      {isOpen &&
        <Modal children={content} />
      }
      {children}
    </ModalContext.Provider>
  )
}