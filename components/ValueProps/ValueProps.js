import React from 'react';
import Image from 'next/image';

import classes from './ValueProps.module.scss';

const ValueProps = ({ fields }) => {
  const { valueProps } = fields;

  return (
    <div className={`${classes['props']} ${classes[fields.backgroundColor]}`}>
        <div className={classes['props__text']}>
            {fields.header && <h1>{fields.header}</h1>}
            {fields.subheader && <h2>{fields.subheader}</h2>}
        </div>
        <div className={`${classes['props__row']}`}>
           {valueProps.map((valueProp) => {
               return (
                    <div className={classes['props__col']} key={valueProp.key}>
                        {valueProp.propImage.asset.url && <div className={classes['props__col--img']}>
                            <Image
                                src={valueProp.propImage.asset.url}
                                layout="responsive"
                                width={100}
                                height={100}
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
    </div>
  );
};

export default ValueProps;
