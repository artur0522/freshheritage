import classes from './AllKnowYourFishBlock.module.scss'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from 'services'
import ResponsiveImage from '@/components/ResponsiveImage'
import { useKnowYourFishDrawerContext } from '@/context/KnowYourFishDrawerContext'

const AllKnowYourFishblock = ({fields}) => {

  const { openDrawer } = useKnowYourFishDrawerContext()

  const { header, subheader, knowYourFishList } = fields

  if (!knowYourFishList) {
    return ''
  }

  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source) {
    return builder.image(source)
  }

  return (
    <div className={classes['all-know-your-fish-block']}>
      <div className="container">
        <div className={classes['all-know-your-fish-block__header']}>
          {header && <h2 className="h1">{header}</h2>}
          {subheader && <p>{subheader}</p>}
        </div>
        <ul className={classes['all-know-your-fish-block__list']}>
          {knowYourFishList.map(item => {

            const { header, peakSeason, nutritionalInfo, image } = item

            if (!image?.asset) {
              return ''
            }

            const cropImageUrl = image ? urlFor(image).width(438).height(600).focalPoint(image.hotspot.x, image.hotspot.y).crop('focalpoint').fit('crop').url() : undefined

            const imageInlineStyles = {
              'filter': `brightness(${image?.imageBrightness ? image.imageBrightness : 100}%)`
            }

            return (
              <li className={classes['all-know-your-fish-block__item']} key={item._id}>
                <div className={classes['all-know-your-fish-block__item-container']}>
                  {cropImageUrl && <div className={classes['all-know-your-fish-block__item-image']}>
                    <ResponsiveImage src={cropImageUrl} alt={image.asset.alt || ''}  style={imageInlineStyles} />
                    <button className={classes['all-know-your-fish-block__more-info-btn']} onClick={() => openDrawer({ fields: item})}></button>
                  </div>}
                  <div className={classes['all-know-your-fish-block__item-content']}>
                    {header && <h2 className={classes['all-know-your-fish-block__item-header']}>{header}</h2>}
                    {peakSeason && <div className={classes['all-know-your-fish-block__detail-item']}>
                      <h3>Peak Season:</h3>
                      <p>{peakSeason}</p>
                    </div>}
                    {nutritionalInfo && <div className={classes['all-know-your-fish-block__detail-item']}>
                      <h3>Nutritional info:</h3>
                      <p>{nutritionalInfo}</p>
                    </div>}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default AllKnowYourFishblock