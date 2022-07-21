import classes from './FeaturedFishCarousel.module.scss'

const FeaturedFishCarousel = ({fields}) => {

  console.log("fields:", fields)

  const { header, subheader, featuredFishes } = fields


  return (
    <div className={classes['featured-fish-carousel']}>
      <div className={`${classes['featured-fish-carousel__header']} container`}>
        <h2 className="h1">{header}</h2>
        <p>{subheader}</p>
        {featuredFishes.length > 0 &&
          <ul>
            {featuredFishes.map(item => {

              const { header, peakSeason, image } = item

              return <li>
                <h2 className="h2">{header}</h2>
                <h3 className="h3">{peakSeason}</h3>
                <button className="btn pureWhite">Learn More</button>
              </li>
            })}
          </ul>
        }
      </div>
    </div>
  )
}

export default FeaturedFishCarousel