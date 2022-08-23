import { useSearchBox } from 'react-instantsearch-hooks-web'
import classes from "./CustomSearchBox.module.scss"
import { useState } from 'react'
import Stats from '../Stats'
import IconSearch from '@/svgs/search.svg'

const CustomSearchBox = (props) => {
  const { query, refine } = useSearchBox(props)
  const [searchTerm, setSearchTerm] = useState("")


  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    refine(e.target.value)
  }

  return (
    <div className={classes['searchbox-wrap']}>
      {/* {query && <Stats />} */}
      <div className={classes['searchbox']}>
        <IconSearch />
        <input className="h6" type="text" placeholder="Search here" onChange={(e) => handleChange(e)} value={searchTerm} />
      </div>
    </div>
  )
}

export default CustomSearchBox