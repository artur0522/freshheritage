
import { useState, useEffect } from 'react'
import FAQItem from './FAQItem'
import classes from './FAQs.module.scss'
import ResponsiveImage from '@/components/ResponsiveImage'
import { useMediaQuery } from 'react-responsive'

const illustrationImgLoader = ({ src }) => {
  return `${src}?w=750`
}

const FAQs = ({ fields, parentClasses }) => {

  const [mounted, setMounted] = useState(false)

  const isDesktop = useMediaQuery(
    { minWidth: 1440 }
  )

  useEffect(() =>  {
    setMounted(true)
  }, [])

  return (
    <div className={`${classes['faq']} ${classes[parentClasses]} `}>
      {!!fields.desktopIllustration && !!fields.mobileIllustration &&
        <>
         {isDesktop && mounted && fields.desktopIllustration?.asset?.url &&
          <div className={classes['faq__image']}>
            <ResponsiveImage loader={illustrationImgLoader} src={fields.desktopIllustration.asset.url} alt={fields.desktopIllustration.asset.alt || 'illustration'} />
          </div>
         }
         {!isDesktop && mounted && fields.mobileIllustration?.asset?.url &&
          <div className={classes['faq__image']}>
            <ResponsiveImage loader={illustrationImgLoader} src={fields.mobileIllustration.asset.url} alt={fields.mobileIllustration.asset.alt || 'illustration'} />
          </div>
         }
        </>
      }
      <div className={`${classes['faq__container']} container`}>
        <div className={classes['faq__header']}>
          <h2 className="h1">{fields.header}</h2>
        </div>
        <div className={classes['faq__content']}>
          <ul className={classes['faq__items']}>
            {fields.faqItems.map(item => {
              return <FAQItem key={item._id} item={item} />
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FAQs