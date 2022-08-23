import { useState } from 'react'
import Link from 'next/link'
import Expand from 'react-expand-animated'
import { PortableText } from '@portabletext/react'
import ResponsiveImage from '@/components/ResponsiveImage'
import classes from './AccordionItem.module.scss'
import IconMinus from '@/svgs/minus.svg'
import IconPlus from '@/svgs/plus.svg'

const AccordionItem = ({props}) => {

  const { title, text, image } = props
  const [height, setHeight] = useState(0)

  const myPortableTextComponents = {
    marks: {
      link: ({children, value}) => {
        if (!value.href) return <span>{children}</span>
        if (value.href.includes('mailto')) {
          return <a rel="noreferrer noopener" href={value.href} target="_blank">{children}</a>
        }
        return (
          <Link href={value.href}>
            <a>{children}</a>
          </Link>
        )
      }
    },
    listItem: {
      bullet: ({children}) => {
        return (
          <li className="body">{children}</li>
        )
      },
      number: ({children}) => {
        return (
          <li className="body">{children}</li>
        )
      }
    }
  }

  const toggleExpand = (e) => {
    e.preventDefault()
    height === 0 ? setHeight('auto') : setHeight(0)
  }

  return (
    <li className={classes['accordion-item']}>
      <button className={classes['accordion-item__btn']} onClick={(e) => toggleExpand(e)}>
        {image &&
          <div className={classes['accordion-item__image']}>
            <ResponsiveImage src={image.asset.url} alt={title} />
          </div>
        }
        {title}
        {height !== 0 ? (
          <IconMinus className={classes['minus']} />
        ):(
          <IconPlus className={classes['plus']} />
        )}
      </button>
      <Expand open={height !== 0} duration={300}>
        <div className={classes['accordion-item__text']}>
          <PortableText components={myPortableTextComponents} value={text} />
        </div>
      </Expand>
    </li>
  )
}

export default AccordionItem