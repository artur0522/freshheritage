import classes from './ArticleNav.module.scss'

const ArticleNav = ({fields}) => {

  const { directions, ingredients, proTips } = fields;

  return (
    <div className={classes['article-nav']}>
      <ul className={classes['article-nav-list']}>
        {ingredients &&
          <li><button>Ingredients</button></li>
        }
        {directions &&
          <li><button>Directions</button></li>
        }
        {proTips &&
          <li><button>Pro Tips</button></li>
        }
      </ul>
    </div>
  )
}

export default ArticleNav