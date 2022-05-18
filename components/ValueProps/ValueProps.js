import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import classes from './ValueProps.module.scss';

const ValueProps = ({ fields }) => {
  const { valueProps } = fields;
  let extraPropsClass;
  if(valueProps.length > 4) {
      extraPropsClass = 'extra-props'
  } else {
      extraPropsClass = null;
  }


  return (
    <div className={`${classes['props']} ${classes[fields.backgroundColor]}`}>
        <div className={classes['props__text']}>
            {fields.header && <h1>{fields.header}</h1>}
            {fields.subheader && <h2>{fields.subheader}</h2>}
        </div>
        <div className={`${classes['props__row']} ${classes[extraPropsClass]}`}>
           {valueProps.map((valueProp) => {
               return (
                    <div className={`${classes['props__col']} ${classes[extraPropsClass]}`} key={valueProp.key}>
                        {valueProp.propImage.asset.url && <div className={classes['props__col--img']}>
                            <Image
                                src={valueProp.propImage.asset.url}
                                layout="fill"
                                objectFit='contain'
                                objectPosition={'center'}
                            />
                        </div>}
                        <div className={classes['props__col--text']}>
                            {valueProp.propHeader && <h1 className="heading--prop">{valueProp.propHeader}</h1>}
                            {valueProp.propSubheader && <p className="secondary__body">{valueProp.propSubheader}</p>}
                        </div>
                    </div>
               )
           })}
        </div>

        {fields.ctaUrl && <Link href={`${fields.ctaUrl}`}>
                    <a className={`${classes['props__btn']} salmon btn text-align--center no-underline`}>
                    {fields.ctaText}
                    </a>
        </Link>}
    </div>
  );
};

export default ValueProps;
