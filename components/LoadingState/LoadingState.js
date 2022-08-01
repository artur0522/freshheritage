import classes from './LoadingState.module.scss'

const LoadingState = () => {
  return (
    <div className={classes['loader-wrapper']}>
      <div className={classes['loader']}></div>
    </div>
  )
}

export default LoadingState