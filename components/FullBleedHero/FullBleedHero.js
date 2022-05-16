import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';
import Link from 'next/link';

import classes from './FullBleedHero.module.scss';

const FullBleedHero = ({ fields }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isDesktop = useMediaQuery(
    {query: '(min-width: 768px)'}
  )
  const { heroStyle } = fields;

  let desktopImage = fields.desktopBackgroundImage;
  let mobileImage = fields.mobileBackgroundImage;
  let btnColor;

  // Check if desktop image exists
  if (desktopImage) {
    desktopImage = (
      <Image
        className={classes.mbl__img}
        src={fields.desktopBackgroundImage.asset.url}
        layout="fill"
      />
    );
  } else {
    desktopImage = null;
  }

  // Check if mobile image exists
  if (mobileImage) {
    mobileImage = (
      <Image
        className={classes.dsktp__img}
        src={fields.mobileBackgroundImage.asset.url}
        layout="fill"
      />
    );
  } else {
    mobileImage = null;
  }

  // Conditionally change the color of the button
  if (heroStyle === 'hero__center') {
    btnColor = 'alabaster';
  } else {
    btnColor = 'salmon';
  }
  
  return (
    <div className={`${classes['hero']} ${classes[heroStyle]}`}>
     
      <div className={classes['hero__text']}>
        <div className={classes['hero__text--inner']}>
          {fields.header && <h1>{fields.header}</h1>}
          {fields.subheader && <h2>{fields.subheader}</h2>}

          {fields.primaryCtaUrl && <Link href={`${fields.primaryCtaUrl}`}>
            <a className={`${classes['btn']} btn salmon no-underline`}>
            {fields.primaryCtaText}
            </a>
          </Link>}

          {fields.secondaryCtaUrl && <Link href={`${fields.secondaryCtaUrl}`}>
            <a>{fields.secondaryCtaText}</a>
          </Link>}
        </div>
      </div>

      {isMobile && <div className={`${classes['hero__wrap--mbl']} ${classes['hero__wrap']} `}>
            {mobileImage}
        </div>}
        
        {isDesktop && <div className={`${classes['hero__wrap--dsktp']} ${classes['hero__wrap']}`}>
            {desktopImage}
        </div>}
    </div>
  );
};

export default FullBleedHero;
