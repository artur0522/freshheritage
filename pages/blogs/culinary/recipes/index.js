import React from 'react'
import { nacelleClient } from 'services'

const RecipeListings = (props) => {
  console.log(props)
  return (
    <div>
        hello world
    </div>
  )
}

export default RecipeListings

// export async function getStaticPaths() {
//   const recipeArticles = await nacelleClient.content({
//     type: 'recipeArticle'
//   })

//   const handles = recipeArticles.map((article) => ({ params: { handle: article.handle } }))

//   return {
//     paths: handles,
//     fallback: 'blocking'
//   }
// }

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    type: 'recipeArticle'
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      pages: pages
    }
  }
}