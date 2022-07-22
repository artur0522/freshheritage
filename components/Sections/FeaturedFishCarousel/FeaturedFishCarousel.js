import { useRef, useState, useEffect, useCallback } from 'react'
import classes from './FeaturedFishCarousel.module.scss'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from 'services'
import ResponsiveImage from '@/components/ResponsiveImage'
import { useKnowYourFishDrawerContext } from '@/context/KnowYourFishDrawerContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import IconArrowLeft from '@/svgs/arrow-left.svg'
import "swiper/css"

const FeaturedFishCarousel = ({fields}) => {

  const builder = imageUrlBuilder(sanityClient)
  const { openDrawer } = useKnowYourFishDrawerContext()
  const [swiper, setSwiper] = useState()

  const sliderRef = useRef(null);
  const prevSlideBtnRef = useRef()
  const nextSlideBtnRef = useRef()

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  function urlFor(source) {
    return builder.image(source)
  }

  const { header, subheader, featuredFishes } = fields

  return (
    <div className={classes['featured-fish-carousel']}>
      <div className={`${classes['featured-fish-carousel__header']} container`}>
        <h2 className="h1">{header}</h2>
        <p>{subheader}</p>
        {featuredFishes.length >= 4 && <div className={classes['feature-fish-carousel__nav-btns']}>
          <button className={classes['feature-fish-carousel__nav-btn']} onClick={handlePrev} ref={prevSlideBtnRef}><IconArrowLeft /></button>
          <button className={classes['feature-fish-carousel__nav-btn']} onClick={handleNext} ref={nextSlideBtnRef}><IconArrowLeft /></button>
        </div>}
      </div>
      {featuredFishes.length > 0 &&
        <Swiper
          ref={sliderRef}
          slidesPerView={'auto'}
          spaceBetween={40}
          threshold={2}
          onSwiper={setSwiper}
          onProgress={({progress}) => {
            if (progress <= 0) {
              prevSlideBtnRef.current.style.opacity = 0.3
              prevSlideBtnRef.current.style.pointerEvents = 'none'
              nextSlideBtnRef.current.style.opacity = 1
              nextSlideBtnRef.current.style.pointerEvents = 'auto'
            } else if (progress >= 1) {
              prevSlideBtnRef.current.style.opacity = 1
              prevSlideBtnRef.current.style.pointerEvents = 'auto'
              nextSlideBtnRef.current.style.opacity = 0.3
              nextSlideBtnRef.current.style.pointerEvents = 'none'
            } else {
              prevSlideBtnRef.current.style.opacity = 1
              prevSlideBtnRef.current.style.pointerEvents = 'auto'
              nextSlideBtnRef.current.style.opacity = 1
              nextSlideBtnRef.current.style.pointerEvents = 'auto'
            }
          }}
          className={classes['featured-fish-carousel__item-list']}>
            {featuredFishes.map(item => {

              const { header, peakSeason, image } = item
              const cropImageUrl = urlFor(image).width(438).height(600).focalPoint(image.hotspot.x, image.hotspot.y).crop('focalpoint').fit('crop').url()

              const imageInlineStyles = {
                'filter': `brightness(${image?.imageBrightness ? image.imageBrightness : 100}%)`
              }

              return <SwiperSlide className={classes['featured-fish-carousel__item']} key={item._id}>
                <div className={classes['featured-fish-carousel__item-image']}>
                  <ResponsiveImage src={cropImageUrl} alt={image.asset.alt || ''}  style={imageInlineStyles} />
                </div>
                <div className={classes['feature-fish-carousel__content']}>
                  <h2 className="h4">{header}</h2>
                  <h3 className="h3">{peakSeason}</h3>
                  <button onClick={() => openDrawer({ fields: item})}
                    className={`${classes['feature-fish-carousel__content-btn']} btn pureWhite`}>Learn More</button>
                </div>
              </SwiperSlide>
            })}
        </Swiper>


      }
    </div>
  )
}

export default FeaturedFishCarousel