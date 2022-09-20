import { useModalContext } from '@/context/ModalContext'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'

import classes from "./GatedProductModal.module.scss"

const GatedProductModal = () => {
  const modalContext = useModalContext()
  const { content, setPrevContent, prevContent, setIsOpen, modalType } = modalContext
  const {header, signInText, signInUrl, ctaText, ctaUrl, description, reminder} = {...content}

  const openAccountModal = (e) => {
    e.preventDefault()

    setPrevContent(content)

    modalContext.setIsOpen(false)
    setIsOpen(true)
    modalContext.setModalType('login')
  }

  return (
    <div className={`${classes['gated-modal']} container`}>
      <div className={`${classes['reminder']} flex flex--justify-center flex--align-center`}>
        {reminder && <PortableText value={reminder} />}
        {signInText && <button onClick={(e) => openAccountModal(e)} className="salmon">
          {signInText}
        </button>}
      </div>
      <div className={classes['header']}>
        {header && <h4>{header}</h4>}
      </div>
      {description && <div className={`${classes['description']} h5`}>
        <PortableText value={description} />
      </div>}
      {ctaText && <div className={classes['btn-wrap']}>
        <Link href={ctaUrl}>
          <a className="btn salmon">{ctaText}</a>
        </Link>
      </div>}
    </div>
  )
}

export default GatedProductModal
