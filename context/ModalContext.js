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
  }, [isOpen])

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

export async function getStaticProps({ params }) {
  const { products } = await nacelleClient.query({
    query: PAGE_QUERY,
    variables: { handle: params.handle }
  })

  const page = await nacelleClient.content({
    handles: ['product']
  })

  if (!products.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      product: products[0],
      page
    }
  }
}