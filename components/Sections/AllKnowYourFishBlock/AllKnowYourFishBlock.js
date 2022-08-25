import { useState } from 'react'
import classes from './AllKnowYourFishBlock.module.scss'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from 'services'
import ResponsiveImage from '@/components/ResponsiveImage'
import { useKnowYourFishDrawerContext } from '@/context/KnowYourFishDrawerContext'
import InfoCircle from '@/svgs/info-circle.svg'
import moment from 'moment'
import { useMediaQuery } from 'react-responsive'

const AllKnowYourFishblock = ({fields}) => {

  const { openDrawer } = useKnowYourFishDrawerContext()

  const { header, subheader, knowYourFishList } = fields

  const [fishList, setFishList] = useState(knowYourFishList)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  if (!knowYourFishList) {
    return ''
  }

  // const sortListings = (value) => {
  //   const sorted = fishList.sort((a, b) => {
  //     let aPublishedDate = moment(a._createdAt).unix()
  //     let bPublishedDate = moment(b._createdAt).unix()
  //     if (a.fields?.publishedDate) {
  //       aPublishedDate = moment(a.fields.publishedDate).unix()
  //     }
  //     if (b.fields?.publishedDate) {
  //       bPublishedDate = moment(b.fields.publishedDate).unix()
  //     }
  //     return (value === 'newest') ? aPublishedDate - bPublishedDate : bPublishedDate - aPublishedDate
  //   })
  //   setFishList([...sorted])
  // }

  const builder = imageUrlBuilder(sanityClient)

  function urlFor(source) {
    return builder.image(source)
  }

  return (
    <div className={classes['all-know-your-fish-block']}>
      <div className="container">
        <div className={classes['all-know-your-fish-block__header']}>
          <div>
            {header && <h2 className="h1">{header}</h2>}
            {subheader && <p>{subheader}</p>}
          </div>
          {/* <div className={classes['sort-by']}>
             <label className="body">Sort By</label>
             <select className="body" onChange={(e) => sortListings(e.target.value)}>
               <option value="newest">Newest</option>
               <option value="oldest">Oldest</option>
             </select>
           </div> */}
        </div>
        <ul className={classes['all-know-your-fish-block__list']}>
          {fishList.map((item, index) => {

            const { header, peakSeason, nutritionalInfo, image } = item

            if (!image?.asset) {
              return ''
            }

            let cropImageUrl = image.asset.url

            if (image.hotspot) {
              cropImageUrl = image ? urlFor(image).width(isMobile ? 600 : 350).height(isMobile ? 570 : 385).focalPoint(image.hotspot.x, image.hotspot.y).crop('focalpoint').fit('crop').url() : undefined
            }

            const imageInlineStyles = {
              'filter': `brightness(${image?.imageBrightness ? image.imageBrightness : 100}%)`
            }

            return (
              <li onClick={() => openDrawer({ fields: item})} className={classes['all-know-your-fish-block__item']} key={index}>
                <div className={classes['all-know-your-fish-block__item-container']}>
                  {cropImageUrl && <div className={classes['all-know-your-fish-block__item-image']}>
                    <ResponsiveImage src={cropImageUrl} alt={image.asset.alt || ''}  style={imageInlineStyles} />
                    <span
                      className={classes['all-know-your-fish-block__more-info-btn']}>
                        <InfoCircle />
                    </span>
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