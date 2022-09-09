import classes from './Tabs.module.scss'

export default function Tabs({tabs, selected, onSelected, onSignOut}) {

  const isTabSelected = (tabName) => tabName === selected;

  const listTabs = tabs.map((tab) =>
    (<span className={classes['tab']} key={tab}>
      <button onClick={() => onSelected(tab)}>{tab}</button>
      <div className={`${classes['indicator']} ${isTabSelected(tab) ? classes['show'] : classes['hidden']}`}></div>
    </span>)
  );

  listTabs.push((<span className={classes['tab']} key='sign-out-tab'>
  <button onClick={() => onSignOut()}>Sign Out</button>
</span>))

  return (
    <div className={classes['tabs']}>
      {listTabs}
    </div>
    )
}
