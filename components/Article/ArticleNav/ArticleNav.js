import { useState, useEffect, useRef, forwardRef } from 'react'
import classes from './ArticleNav.module.scss'
import { animateScroll as scroll } from 'react-scroll'
import { useHeaderContext } from '@/context/HeaderContext'

const ArticleNav = forwardRef(({}, ref) => {

  const [activeTab, setActiveTab] = useState(Object.keys(ref.current)[0])
  const navRef = useRef()
  const { hide, headerRef } = useHeaderContext()

  const getScrollPosition = (el) => {
    const navRefHeight = navRef.current.offsetHeight + 20
    return el.getBoundingClientRect().top + window.scrollY - navRefHeight
  }

  const onClick = (value) => {
    const sectionEl = ref.current[`${value}`].current
    const sectionElTopPosition = getScrollPosition(sectionEl)
    scrollToEl(sectionElTopPosition)
  }

  const scrollToEl = (value) => {
    scroll.scrollTo(value, {
      duration: 300,
    })
  }

  const onScroll = () => {
    const getActiveTab = Object.keys(ref.current).reduce((carry, key) => {
      const tab = ref.current[key].current
      const tabTopPosition = getScrollPosition(tab)
      if (window.pageYOffset + 1 >= tabTopPosition) return key
      return carry
    }, Object.keys(ref.current)[0])
    setActiveTab(getActiveTab)
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div ref={navRef} className={classes['article-nav']} style={{'top': `${ hide ? 0 : headerRef.current?.offsetHeight}px`}}>
      <ul className={classes['article-nav-list']}>
        {Object.keys(ref.current).map((item, index) => {
          return <li key={index} className={activeTab === item ? classes['is-active'] : ''}><button onClick={() => onClick(item)}>{item}</button></li>
        })}
      </ul>
    </div>
  )
})

export default ArticleNav