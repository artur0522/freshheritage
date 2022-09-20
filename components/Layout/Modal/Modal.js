import classes from './Modal.module.scss'
import { useModalContext } from '@/context/ModalContext'
import IconClose from '@/svgs/close.svg'
import CreateAccountForm from '@/components/Forms/CreateAccountForm'
import LoginAccountForm from '@/components/Forms/LoginAccountForm'
import ForgotPasswordForm from '@/components/Forms/ForgotPasswordForm'
import GatedProductModal from '@/components/Forms/GatedProductModal'
import CookingClassSignupForm from '@/components/Forms/CookingClassSignupForm'

const Modal = ({props, children}) => {

  const modalContext = useModalContext()
  const { prevContent } = modalContext

  const getContent = (type, children) => {
    switch(type) {
      case 'create':
        return <CreateAccountForm />
      case 'login':
        return <LoginAccountForm />
      case 'forgot_password':
        return <ForgotPasswordForm />
      case 'gated_product':
        return <GatedProductModal />
      case 'cooking_class_signup':
        return <CookingClassSignupForm />
      default:
        return children
    }
  }

  const closeModal = () => {
    modalContext.setIsOpen(false)

    if(prevContent) {
      modalContext.setContent(prevContent)
      modalContext.setModalType('gated_product')
      modalContext.setIsOpen(true)
    }
  }

  return (
    <div className={`${classes['modal']} ${modalContext.modalType === 'gated_product' ? classes['gated-zindex'] : ''}`}>
      <div
        onClick={modalContext.modalType !== 'gated_product' ? () => closeModal() : undefined}
        className={`${classes['modal__overlay']} ${modalContext.modalType !== 'gated_product' && modalContext.modalType !== 'cooking_class_signup' ? classes['blur'] : ''}`}>
      </div>
      <div className={`${classes['modal__content']} ${modalContext.modalType === 'gated_product' ? classes['gated-content'] : ''}`}>
        <div className={`${classes['modal__content-container']} ${modalContext.modalType === 'gated_product' ? classes['gated-container'] : ''}`}>
          {modalContext.modalType !== 'gated_product' && <button
            onClick={() => closeModal()}
            className={classes['modal__close-btn']}>
            <IconClose />
          </button>}
          {getContent(modalContext.modalType, children)}
        </div>
      </div>
    </div>
  )
}

export default Modal