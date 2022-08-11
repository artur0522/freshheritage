import classes from "./FooterProps.module.scss"

const FooterProps = (props) => {
  const { footerProps } = props.props

  return (
        <div className={`${classes['footer-props']}`}>
            <div className="container text-align--center">
                {footerProps && <p className={`${classes['inner']} secondary--body`}>
                    {footerProps}
                </p>}
            </div>
        </div>
  )
}

export default FooterProps