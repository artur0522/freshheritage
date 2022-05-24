import React, { useState, useEffect } from 'react';

import FullBleedHero from '../FullBleedHero';
import SplitHero from '../SplitHero';
import { useCustomerContext } from '@/context/CustomerContext'

const DynamicHero = ({ fields }) => {
  const { heroType, fullBleedHero, splitHero } = fields;
  const { customer } = useCustomerContext();

  if(heroType === 'hero--full') {
    return <FullBleedHero fields={fullBleedHero} />
  } else {
    return <SplitHero fields={splitHero} />
  }
};

export default DynamicHero;
