import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import classes from './FullBleedHero.module.scss';

const FullBleedHero = ({ fields }) => {
  console.log('fields', fields);
  const { heroStyle } = fields;
  console.log(heroStyle);
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

  console.log(btnColor);

  return (
    <div className={`${classes['hero']} ${classes[heroStyle]}`}>
      <div className={`${classes['hero__wrap--mbl']} ${classes['hero__wrap']}`}>
        {mobileImage}
      </div>
      <div
        className={`${classes['hero__wrap--dsktp']} ${classes['hero__wrap']}`}
      >
        {desktopImage}
      </div>

      <div className={classes.hero__text}>
        <div className={classes['hero__text--inner']}>
          <h1>{fields.header}</h1>
          <h2>{fields.subheader}</h2>

          <Link href="{`${fields.primaryCtaUrl}`}">
            <a className={`${classes['btn']} btn ${classes[btnColor]}`}>
              {fields.primaryCtaText}
            </a>
          </Link>

          <Link href="{`${fields.secondaryCtaUrl}`}">
            <a>{fields.secondaryCtaText}</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FullBleedHero;
