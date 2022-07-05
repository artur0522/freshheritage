
import FAQItem from './FAQItem'
import classes from './FAQs.module.scss'
import ResponsiveImage from '@/components/ResponsiveImage'
import { useMediaQuery } from 'react-responsive'

const FAQs = ({ fields, parentClasses }) => {

  const isDesktop = useMediaQuery(
    { minWidth: 1440 }
  )

  return (
    <div className={`${classes['faq']} ${classes[parentClasses]} `}>
      {!!fields.desktopIllustration && !!fields.mobileIllustration &&
        <>
         {isDesktop &&
          <div className={classes['faq__image']}>
            <ResponsiveImage src={fields.desktopIllustration.asset.url} alt={fields.desktopIllustration.asset.alt || 'FAQ Image'} />
          </div>
         }
         {!isDesktop &&
          <div className={classes['faq__image']}>
            <ResponsiveImage src={fields.mobileIllustration.asset.url} alt={fields.mobileIllustration.asset.alt || 'FAQ Image'} />
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