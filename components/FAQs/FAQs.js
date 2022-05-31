import Image from 'next/image'
import FAQItem from './FAQItem'
import classes from './FAQs.module.scss'

const FAQs = ({ fields, parentClasses }) => {
  return (
    <div className={`${classes['faq']} ${classes[parentClasses]} `}>
      {!!fields.illustration &&
        <div className={classes['faq__image']}>
          <Image src={fields.illustration.asset.url} layout="fill" objectFit="contain" alt={fields.illustration.asset.alt || 'FAQ Image'} />
        </div>
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