import classes from './Footer.module.scss'

import FooterTop from './FooterTop'
import FooterNavigation from './FooterNavigation'
import FooterBottom from './FooterBottom'

const Footer = ({ content }) => {

  if (!content) {
    return ''
  }

  return (
    <footer className={classes.footer}>
      <div className="container">
        <FooterTop props={content} classes={classes} />
        <FooterNavigation props={content} classes={classes} />
        <FooterBottom props={content} classes={classes} />
      </div>
    </footer>
  )
}

export default Footer
