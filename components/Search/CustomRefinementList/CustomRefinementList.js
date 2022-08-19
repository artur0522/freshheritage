import { useRefinementList } from 'react-instantsearch-hooks-web'
import { useState, useEffect } from 'react'
import { filter } from 'lodash-es'
import { useRouter } from 'next/router'

const CustomRefinementList = (props) => {
  const {
    items,
    refine
  } = useRefinementList(props)

//   const { handleArticleIndex } = props

//   const [isRefined, setIsRefined] = useState(false)
//   const [filteredItems, setFilteredItems] = useState(items)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     console.log(items)
//     setMounted(true)
//     setFilteredItems("items", items)
//     console.log("filteredItems", filteredItems)
//   }, [mounted, filteredItems])

  const refineIndex = (value) => {
    refine(value)

    // const newArr = filteredItems
    // const foundValue = newArr.find((item) => item.value === value)

    // if(foundValue.isRefined == true) {
    //     foundValue.isRefined = false
    //     setIsRefined(false)
    // } else {
    //     foundValue.isRefined = true
    //     setIsRefined(true)
    // }
   
    // setFilteredItems(newArr)
    
    // const findCheckbox = items.find(item => item.isRefined === true)
    // if(findCheckbox && mounted) {
    //     setRefinedFound(true)
    //     handleArticleIndex(refinedFound)
    // } else {
    //     setRefinedFound(false)
    //     handleArticleIndex(refinedFound)
    // }
  }

  return (
    <div>
        {items.map((item) => {
            return (
                <div key={item.value}>
                    <label>
                        <input 
                            type="checkbox" 
                            onChange={() => refine(item.value)} 
                        />
                        {item.label}
                    </label>
                </div>
            )
        })}
    </div>
  )
}

export default CustomRefinementList