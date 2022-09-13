import classes from './PurchaseFlowHeader.module.scss'
import IconBullet from '@/svgs/list-item.svg'

const PurchaseFlowHeader = ({props}) => {
  return (
    <div className={classes['purchase-flow__header']}>
      <h1>{props.header}</h1>
      <h2>{props.subheader}</h2>
      <ul className={classes['purchase-flow__value-props']}>
        {props.headerBullets && props.headerBullets.map((item, index) => {
          return <li className="secondary--body" key={index}><IconBullet />{item}</li>
        })}
      </ul>
    </div>
  )
}

export default PurchaseFlowHeader