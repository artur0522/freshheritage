import Link from 'next/link'
const FooterBottom = ({props, classes}) => {
  return (
    <div className={[classes.footerSection, classes.footerBottom].join(' ')}>
      <div className={classes.copyRight}>
        {props.copyright}
      </div>
      <div className={classes.termsLinksContainer}>
        <ul className={classes.termsLinks}>
          {props.termsLinks.map(item => {
            return <li key={item._key}>
              <Link href={item.linkUrl ? item.linkUrl : ''}>
                <a>
                  {item.linkText}
                </a>
              </Link>
            </li>
          })}
        </ul>
      </div>
    </div>
  )
}

export default FooterBottom