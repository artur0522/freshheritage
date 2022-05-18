import React from 'react';
import { PortableText } from '@portabletext/react';
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image';
import Link from 'next/link';

import classes from './SplitHero.module.scss';
import IconBullet from '@/svgs/list-item.svg'

const SplitHero = ({ fields }) => {
  console.log(fields);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isDesktop = useMediaQuery(
    {query: '(min-width: 768px)'}
  )
  const { imageContainer, imageWidth, style, textColor, valueProps, disclaimer } = fields;

  let desktopImage = fields.desktopBackgroundImage;
  let mobileImage = fields.mobileBackgroundImage;
  let mappedValueProps;
  let disclaimerMessage = disclaimer[0].children[0].text;

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

  if(valueProps) {
    mappedValueProps = <ul className={classes['value-props']}>{
      valueProps.map((prop) => 
        <li className="body" key={prop}><span><IconBullet /></span>{prop}</li>
    )}
    </ul>
  } else {
    mappedValueProps =  null;
  }

  return (
    <div className={`${classes['hero']} ${classes[style]} ${classes[imageContainer]} ${classes[textColor]}`}>
      <div className={`${classes['hero__row']}`}>
      <div className={classes.hero__text}>
          <div className={classes['hero__text--inner']}>
            {fields.header && <h1>{fields.header}</h1>}
            {fields.subheader && <h2 className={classes['subheader']}>{fields.subheader}</h2>}

            {mappedValueProps && mappedValueProps}
            
            <div className={classes['btn-wrap']}>
              {fields.primaryCtaUrl && <Link href={`${fields.primaryCtaUrl}`}>
                  <a className={`btn salmon no-underline text-align--center`}>
                  {fields.primaryCtaText}
                  </a>
              </Link>}
             
              {fields.secondaryCtaUrl && <Link href={`${fields.secondaryCtaUrl}`}>
                  <a className={`btn--only-mobile alabaster ${classes['secondary-btn']}`}>{fields.secondaryCtaText}</a>
              </Link>}

              {!fields.secondaryCtaUrl && fields.secondaryCtaText && <h2 className={classes['secondary-text']}>{fields.secondaryCtaText}</h2>}
            </div>

            {disclaimer && <div className={`${classes['disclaimer']} body`}>
              <PortableText
                value={disclaimer}
              />
            </div>}
          </div>
        </div>

        {isMobile && <div className={`${classes['hero__wrap--mbl']} ${classes['hero__wrap']} ${classes[imageWidth]}`}>
            {mobileImage}
        </div>}
        
        {isDesktop && <div className={`${classes['hero__wrap--dsktp']} ${classes['hero__wrap']} ${classes[imageWidth]}`}>
            {desktopImage}
        </div>}
      </div>
    </div>
  );
};

export default SplitHero;
