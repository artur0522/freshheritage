import classes from './Tabs.module.scss'
import { useMediaQuery } from 'react-responsive'
import Dropdown from 'react-dropdown'
import IconSelectArrow from '@/svgs/select-arrow.svg'

export default function Tabs({tabs, selected, onSelected, onSignOut}) {
  const isMobile = useMediaQuery({ query: '(max-width: 1074px)' })
  const isDesktop = useMediaQuery(
      {query: '(min-width: 1074px)'}
  )

  const dropdownOptions = [
    {label: `Membership`, value: 'Membership' },
    {label: `Test`, value: 'Test' },
    {label: `123`, value: '123' },
  ]

  const onSelectVariant = () => {

  }

  const isTabSelected = (tabName) => tabName === selected;

  const renderDesktopBody = () => {
    const listTabs = tabs.map((tab) =>
      (<span className={classes['tab']} key={tab}>
        <button onClick={() => onSelected(tab)}>{tab}</button>
        <div className={`${classes['indicator']} ${isTabSelected(tab) ? classes['show'] : classes['hidden']}`}></div>
      </span>)
    );

    listTabs.push((
      <span className={classes['tab']} key='sign-out-tab'>
        <button onClick={() => onSignOut()}>Sign Out</button>
      </span>
    ))
    return listTabs
  }

  const renderMobileBody = () => {
    const dropdownOptions = tabs.map(tab => ({label: tab, value: tab }))
    const selectedTab = tabs.find(t => {
      return isTabSelected(t)
    })

    return (
      <div className={classes['mobile-tabs']}>
        <Dropdown
          className={`dropdown-selector`}
          options={dropdownOptions}
          onChange={(e) => onSelectVariant(e)}
          value={selectedTab}
          arrowClosed={<IconSelectArrow className="dropdown-selector__arrow-closed" />}
          arrowOpen={<IconSelectArrow className="dropdown-selector__arrow-open" />}
        />
      </div>
    )
  }

  return (
    <div className={classes['tabs']}>
      {isDesktop && renderDesktopBody()}
      {isMobile && renderMobileBody()}
    </div>
  )
}
