import classes from './Modal.module.scss'
import { useModalContext } from '@/context/ModalContext'
import IconClose from '@/svgs/close.svg'

const Modal = ({props, children}) => {

  const modalContext = useModalContext()

  const createAccountContent = (classes) => {
    return (
      <>
        <h4>Create A Sitka Seafood Membership Account</h4>
        <h5>Track orders and manage your subscription in your account.</h5>
        <form>
          <div className="input-group">
            <input className="input" placeholder="first name" />
          </div>
          <div className="input-group">
            <input className="input" placeholder="last name" />
          </div>
          <div className="input-group">
            <input className="input" placeholder="email" />
          </div>
          <div className="input-group">
            <input className="input" placeholder="password" />
          </div>
          <button className="btn sitkablue">Create Account</button>
        </form>
        <p>Already a member?&nbsp;
          <button
            onClick={() => modalContext.setModalType('login')}
            className="btn-link-underline">Log In</button>
        </p>
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
          <input className="input" placeholder="email address" />
          </div>
          <div className="input-group">
            <input className="input" placeholder="password" />
          </div>
          <button className="btn sitkablue">Login</button>
        </form>
        <p><button className="btn-link-underline">Forgot Password?</button></p>
        <p>{`Don't have an account? `}
          <button
            onClick={() => modalContext.setModalType('create')}
            className="btn-link-underline">
              Sign Up
          </button>
        </p>
      </>
    )
  }

  const getContent = (type, children) => {
    switch(type) {
      case 'create':
        return createAccountContent()
      case 'login':
        return loginAccountContent()
      default:
        return children
    }
  }

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
  )
}

export default Modal