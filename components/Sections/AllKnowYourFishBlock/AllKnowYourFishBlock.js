import classes from './AllKnowYourFishBlock.module.scss'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from 'services'
import ResponsiveImage from '@/components/ResponsiveImage'
import { useKnowYourFishDrawerContext } from '@/context/KnowYourFishDrawerContext'

const AllKnowYourFishblock = ({fields}) => {

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
                  </div>}
                  <div className={classes['all-know-your-fish-block__content']}>
                    {header && <h2>{header}</h2>}
                    {peakSeason && <div className={classes['know-your-fish__detail-item']}>
                      <h3><b>Peak Season:</b></h3>
                      <h4>{peakSeason}</h4>
                    </div>}
                    {nutritionalInfo && <div className={classes['know-your-fish__detail-item']}>
                      <h3><b>Nutritional info:</b></h3>
                      <h4>{nutritionalInfo}</h4>
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