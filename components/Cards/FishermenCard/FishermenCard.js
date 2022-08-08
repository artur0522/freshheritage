import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'
import InfoIcon from '@/svgs/circle-info.svg'
import ResponsiveImage from '@/components/ResponsiveImage'

import classes from "./FishermenCard.module.scss"

const FishermenCard = ({ article }) => {
  const { image, title, subheader, species } = article
  const drawerContext = useArticleFiltersDrawerContext()
  const { setInfoCard, openFishInfo } = drawerContext

  const openInfoDrawer = () => {
    setInfoCard(article)
    openFishInfo()
  }

  return (
    <div className={classes['article-card__wrap']}>
        <div className={`${classes['article-card']}`}>
                <div className={`${classes['slider__slide']}`}>
                {image.asset.url && <div className={classes['image-wrap']}>
                    <ResponsiveImage alt={title} src={image.asset.url} />
                    <button onClick={() => openInfoDrawer()} className={classes['info-icon']}>
                        <InfoIcon />
                    </button>
                </div>}

                <div className={classes['text']}>
                    {title && <h4 className='heading--article'>{title}</h4>}
                    {subheader && <p className='secondary--body'>{subheader}</p>}
                    {species?.length > 0 && species.map((singleSpecies, index) => <span className="species--title">{index !== 0 && ','} {singleSpecies.header}</span>)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default FishermenCard