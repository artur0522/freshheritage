import React from 'react'
import AccordionItem from './AccordionItem'

const Accordion = ({fields}) => {

  const { accordionItems } = fields

  return (
    <ul className="accordion-items">
      {accordionItems.map(item => {
        return <AccordionItem key={item._key} props={item} />
      })}
    </ul>
  )
}

export default Accordion