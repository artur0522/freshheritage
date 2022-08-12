import classes from './AccountHeader.module.scss'

const AccountHeader = ({firstName}) => {
  return (<div className={classes['header']}><h1>Welcome back, {firstName}</h1></div>)
}

export default AccountHeader;
