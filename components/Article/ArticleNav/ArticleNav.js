import { useState, useEffect, useRef, forwardRef } from 'react'
import classes from './ArticleNav.module.scss'
import { animateScroll as scroll } from 'react-scroll'
import { useHeaderContext } from '@/context/HeaderContext'

const ArticleNav = forwardRef(({ fields }, ref) => {

  const { directions, ingredients, proTips } = fields;
  const [activeTab, setActiveTab] = useState('ingredients')
  const [stickyTopNum, setStickyTopNum] = useState(0)
  const navRef = useRef()
  const { hide, headerRef } = useHeaderContext()

  const getScrollPosition = (el) => {
    const navRefHeight = navRef.current.offsetHeight + 20
    return el.getBoundingClientRect().top + window.scrollY - navRefHeight
  }

  const onClick = (value) => {
    const sectionEl = ref.current[`${value}Ref`].current
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
    }, 'ingredients')
    setActiveTab(`${getActiveTab.replace('Ref', '')}`);
    setStickyTopNum(headerRef.current.getBoundingClientRect().top + headerRef.current.offsetHeight <= 0 ? 0 : headerRef.current.getBoundingClientRect().top + headerRef.current.offsetHeight)
  }

  // useEffect(() => {
  //   console.log("change")
  //   setTimeout(() => {
  //     console.log("init!:", headerRef.current.getBoundingClientRect().top + headerRef.current.offsetHeight)
  //     setStickyTopNum(headerRef.current.getBoundingClientRect().top + headerRef.current.offsetHeight <= 0 ? 0 : headerRef.current.getBoundingClientRect().top + headerRef.current.offsetHeight)
  //   }, 500)
  // }, [hide])


  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div ref={navRef} className={classes['article-nav']} style={{'top': `${stickyTopNum}px`}}>
      <ul className={classes['article-nav-list']}>
        {ingredients &&
          <li className={activeTab === 'ingredients' ? classes['is-active'] : ''}><button onClick={() => onClick('ingredients')}>Ingredients</button></li>
        }
        {directions &&
          <li className={activeTab === 'directions' ? classes['is-active'] : ''}><button onClick={() => onClick('directions')}>Directions</button></li>
        }
        {proTips &&
          <li className={activeTab === 'proTips' ? classes['is-active'] : ''}><button onClick={() => onClick('proTips')}>Pro Tips</button></li>
        }
      </ul>
    </div>
  )
})

export default ArticleNav