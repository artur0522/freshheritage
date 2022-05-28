import { createContext, useContext, useState, useEffect } from 'react'
import PDPDrawer from '@/components/Layout/PDPDrawer'

const PDPDrawerContext = createContext()

export function usePDPDrawerContext() {
  return useContext(PDPDrawerContext)
}

export function PDPDrawerProvider({ children }) {

  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState(null)
  const [productManager, setProductManager] = useState({})

  const openDrawer = (productData) => {
    console.log("productData:", productData)
    setProduct(productData)
    setIsOpen(true)
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
  }, [isOpen])

  useEffect(() => {
    if (product && !productManager[product?.content?.handle]) {
      setProductManager({
        ...productManager,
        [product.content.handle]: product
      })
    }
  }, [product])


  return (
    <PDPDrawerContext.Provider value={{setIsOpen, setProduct, openDrawer, productManager}}>
      {isOpen &&
        <PDPDrawer product={product} />
      }
      {children}
    </PDPDrawerContext.Provider>
  )
}