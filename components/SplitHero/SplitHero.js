import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import classes from './SplitHero.module.scss';

const FullBleedHero = ({ fields }) => {
  console.log('fields', fields);
  const { imageContainer, imageWidth } = fields;
  let desktopImage = fields.desktopBackgroundImage;
  let mobileImage = fields.mobileBackgroundImage;

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

  return (
    <div className={classes.hero}>
        <div className={`${classes['hero__row']} ${classes[imageContainer]}`}>
        <div className={classes.hero__text}>
            <div className={classes['hero__text--inner']}>
            <h1>{fields.header}</h1>
            <h2>{fields.subheader}</h2>

            <Link href="{`${fields.primaryCtaUrl}`}">
                <a className={`${classes['btn']} btn salmon`}>
                {fields.primaryCtaText}
                </a>
            </Link>

            <Link href="{`${fields.secondaryCtaUrl}`}">
                <a>{fields.secondaryCtaText}</a>
            </Link>
            </div>
      </div>

        <div className={`${classes['hero__wrap--mbl']} ${classes['hero__wrap']} ${classes[imageWidth]}`}>
            {mobileImage}
        </div>
        </div>
    </div>
  );
};

export default FullBleedHero;
