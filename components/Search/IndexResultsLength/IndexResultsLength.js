import { useInfiniteHits } from 'react-instantsearch-hooks-web'

const IndexResultsLength = (props) => {
  const { results } = useInfiniteHits(props)
  return (
    <>
        <span>{results.nbHits}</span>
    </>
  )
}

export default IndexResultsLength