const FooterEmailSignup = ({props, classes}) => {
  return (
    <div className={[classes.footerSection, classes.footerEmailSignup].join(' ')}>
      <div className={[classes.footerBlock, classes.footerTop].join(' ')}>
        <h2>{props.header}</h2>
        <p>{props.description}</p>
      </div>
      <div className={classes.footerBlock}>

      </div>
    </div>
  );
};

export default FooterEmailSignup;