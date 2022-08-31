import { useSearchBox } from 'react-instantsearch-hooks-web'
import classes from "./CustomSearchBox.module.scss"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Stats from '../Stats'
import IconSearch from '@/svgs/search.svg'

const CustomSearchBox = (props) => {
  const { query, refine } = useSearchBox(props)
  const [searchTerm, setSearchTerm] = useState("")
  const {currentIndex, setCurrentIndex} = props

  const router = useRouter()

  useEffect(() => {
    if(router.asPath === 'pages/search' || router.asPath.includes("?query")) {
      router.replace({
        pathname: '/pages/search',
        query: { query: searchTerm, index: router.query.index}
      },
      undefined, { shallow: true }
      )
    }
    if(router.query.index) {
      setCurrentIndex(router.query.index)
    }
  }, [searchTerm])

  // useEffect(() => {
  //   if(router.asPath === 'pages/search' || router.asPath.includes("?query")) {
  //     router.push({
  //       pathname: '/pages/search',
  //       query: { 
  //         query: searchTerm,
  //         index: router.query.index
  //       }
  //     },
  //     undefined, { shallow: true }
  //     )
  //   }

  //   if(router.query.index) {
  //     setCurrentIndex(router.query.index)
  //   }

  //   if(router.query.query) {
  //     setSearchTerm(router.query.query)
  //   }
  // }, [searchTerm])

  useEffect(() => {
    const query = router.asPath.split('=')[1]

    if(query) {
      const decoded = decodeURI(query)
      setSearchTerm(decoded)
      refine(query)
    }
  }, [])

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    refine(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && router.asPath !== '/pages/search') {
     router.push(`/pages/search?query=${searchTerm}`)
    }
  }

  return (
    <div className={classes['searchbox-wrap']}>
      {/* {query && <Stats />} */}
      <div className={classes['searchbox']}>
        <IconSearch />
        <input className="h6" type="text" autoFocus placeholder="Search the site..." onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => handleChange(e)} value={searchTerm.replaceAll("&index", '')} />
      </div>
    </div>
  )
}

export default CustomSearchBox