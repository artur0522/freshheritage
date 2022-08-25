import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-hooks-web'
import Link from 'next/link';

import classes from "./ModalArticleHits.module.scss";

const ModalArticleHits = (props) => {
  const { hits, results } = useInfiniteHits(props)
  const { scopedResults } = useInstantSearch(props)
  const { indexId } = props
  const foundScoped = scopedResults?.find(index => index.indexId === indexId)
  const splitIndexId = indexId.split('_')[0]

  return (
    <div className={classes['hits-wrap']}>
      {results.query !== '' && <div className={classes['hits']}>
        <div className={classes['hits-header']}>
          <h6>{foundScoped?.results?.nbHits} {splitIndexId} article results for <span>&#34;{results.query}&#34;</span></h6>
          <Link href={`/pages/search/?query=${results.query}`}>
            <a className="secondary--body">View All</a>
          </Link>
        </div>

        <div className={classes['hits-items']}>
          {hits.slice(0, 3).map((hit) => {
              return (
                <Link href={`/blogs/${hit.blog.blogType}/${hit.blog.handle.current}/${hit.handle.current}`} key={hit.objectID}>
                  <a className="h6">
                    {hit.title}
                  </a>
                </Link>
              )
          })}
        </div>
      </div>}
    </div>
  )
}

export default ModalArticleHits