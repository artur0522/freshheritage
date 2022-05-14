import classes from './Modal.module.scss'
import { useModalContext } from '@/context/ModalContext'
import IconClose from '@/svgs/close.svg'


const createAccountContent = (classes) => {
  return (
    <>
      <h4>Create A Sitka Seafood Membership Account</h4>
      <h5>Track orders and manage your subscription in your account.</h5>
      <form>
        <div className="input-group">
          <input className="input" />
        </div>
        <div className="input-group">
          <input className="input" />
        </div>
        <div className="input-group">
          <input className="input" />
        </div>
        <div className="input-group">
          <input className="input" />
        </div>
        <button className="btn sitkablue">Create Account</button>
      </form>
      <p>Already a member? <button>Log In</button></p>
    </>
  )
}

const loginAccountContent = (classes) => {
  return (
    <>
      <h4>Log in To Your Sitka Seafood Member Portal</h4>
      <h5>Track orders and manage your subscription in your account.</h5>
      <form>
      <div className="input-group">
        <input className="input" />
        </div>
        <div className="input-group">
          <input className="input" />
        </div>
        <div className="input-group">
          <input className="input" />
        </div>
        <div className="input-group">
          <input className="input" />
        </div>
        <button className="btn sitkablue">Login</button>
      </form>
      <p>Forgot Password?</p>
      <p>Don't have an account? <button>Sign Up</button></p>
    </>
  )
}

const getContent = (type, children) => {
  switch(type) {
    case 'create_account':
      return createAccountContent()
    case 'login_account':
      return loginAccountContent()
    default:
      return children
  }
}

const Modal = ({props, children}) => {

  const modalContext = useModalContext()

  return (
    <div className={classes.modal}>
      <div
        onClick={() => modalContext.setIsOpen(false)}
        className={classes.modalOverlay}>
      </div>
      <div className={classes.modalContent}>
        <div className={classes.modalContentContainer}>
          <button
            onClick={() => modalContext.setIsOpen(false)}
            className={classes.modalCloseBtn}>
            <IconClose />
          </button>
          {getContent(modalContext.modalType, children)}
        </div>
      </div>
    </div>
  );
};

export default Modal;