const FooterBottom = ({props, classes}) => {
  return (
    <div className={[classes.footerSection, classes.footerBottom].join(' ')}>
      <div className={classes.copyRight}>
        {props.copyright}
      </div>
      <ul className={classes.termLinks}>
        {props.termsLinks.map(item => {
          return <li key={item._key}>{item.linkText}</li>
        })}
      </ul>
    </div>
  );
};

export default FooterBottom;