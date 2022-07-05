import {useState} from 'react'
import { useModalContext } from '@/context/ModalContext'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { useEffect } from 'react'

import classes from "./GatedProductModal.module.scss"

const GatedProductModal = () => {
  const modalContext = useModalContext()
  const { content } = modalContext
  const {header, signInText, signInUrl, ctaText, ctaUrl, description, reminder} = content

  return (
    <div className={`${classes['gated-modal']} container`}>
      <div className={`${classes['reminder']} flex flex--justify-center flex--align-center`}>
        {reminder && <PortableText value={reminder} />}
        {signInText && <Link href={signInUrl}>
          <a className="salmon">{signInText}</a>
        </Link>}
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
