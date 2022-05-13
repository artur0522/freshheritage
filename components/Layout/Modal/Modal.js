import classes from './Modal.module.scss'

const Modal = ({props}) => {
  return (
    <div className={classes.modal}>
      <div className={classes.modalOverlay}></div>
      <div className={classes.modalContent}></div>
    </div>
  );
};

export default Modal;