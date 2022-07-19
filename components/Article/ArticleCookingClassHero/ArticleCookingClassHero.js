import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import classes from './ArticleCookingClassHero.module.scss'
import moment from 'moment'
import ResponsiveImage from '@/components/ResponsiveImage'
import Image from 'next/image'
import CookingClassSignupForm from '@/components/Forms/CookingClassSignupForm'

const ArticleCookingClassHero = ({fields}) => {

  fields = {
    title: fields.title,
    ...fields.fields,
    featuredClass: {
      listId: fields.fields.featuredClass.klaviyoListId,
      ...fields.fields.featuredClass,
    }
  }

  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  console.log("fields:", fields)

  const { hero } = fields

  useEffect(() => {
    setMounted(true)
  }, [])


  return (
    <div className={`article-cooking-class-hero container`}>
      <div className={classes['article-cooking-class-hero__header']}>
        <h1>{fields.title}</h1>
        <h2>{fields.subheader}</h2>
      </div>
      <div className={classes['article-cooking-class-hero__wrapper']}>
        <div className={classes['article-cooking-class-hero__image']}>
          {hero?.mobileBackgroundImage && isMobile && mounted &&
            <ResponsiveImage
              src={hero?.mobileBackgroundImage.asset.url}
              alt={hero?.mobileBackgroundImage.asset.alt || ''}
            />}
          {hero?.desktopBackgroundImage && isDesktop && mounted &&
            <Image
              src={hero?.desktopBackgroundImage.asset.url}
              layout="fill"
              alt={hero?.desktopBackgroundImage.asset.alt || ''}
            />
          }
        </div>
        <div className={classes['article-cooking-class-hero__content']}>
          <CookingClassSignupForm fields={fields.featuredClass} />
        </div>
      </div>
    </div>
  )
}

export default ArticleCookingClassHero