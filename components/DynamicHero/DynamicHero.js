import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import FullBleedHero from '../FullBleedHero';
import SplitHero from '../SplitHero';

import classes from './DynamicHero.module.scss';


const DynamicHero = ({ fields }) => {
  console.log(fields);
  const { heroType, fullBleedHero, splitHero } = fields;

  if(heroType === 'hero--full') {
    return <FullBleedHero fields={fullBleedHero} />
  } else {
    return <SplitHero fields={splitHero} />
  }
};

export default DynamicHero;
