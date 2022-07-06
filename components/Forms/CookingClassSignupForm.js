import { useState } from 'react'
import { useModalContext } from '@/context/ModalContext'
import Link from 'next/link'

import classes from "./GatedProductModal.module.scss"

const GatedProductModal = () => {
  const modalContext = useModalContext()
  const { content } = modalContext

  return (
    <div className={`${classes['cooking-class-modal']} container`}>

    </div>
  )
}

export default GatedProductModal
