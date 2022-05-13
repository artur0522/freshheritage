const FooterBottom = ({props, classes}) => {
  return (
    <div className={[classes.footerSection, classes.footerBottom].join(' ')}>
      <div className={classes.copyRight}>
        {props.copyright}
      </div>
      <div className={classes.termsLinksContainer}>
        <ul className={classes.termsLinks}>
          {props.termsLinks.map(item => {
            return <li key={item._key}>{item.linkText}</li>
          })}
        </ul>
      </div>
    </div>
  );
};

export default FooterBottom;