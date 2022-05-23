import { useRef, useState } from 'react'
import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import classes from '@/components/Layout/Modal/Modal.module.scss'

const LoginAccountForm = () => {

  const modalContext = useModalContext()
  const customerContext = useCustomerContext()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const response = await customerContext.login({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    })
    if (response.errors?.length) {
      console.log(response)
      setShowErrorMessage(true)
      setErrorMessage(response.errors[0].message)
      setIsLoading(true)
    } else {
      emailRef.current.value = ''
      passwordRef.current.value = ''
      setIsLoading(true)
      setShowErrorMessage('')
      modalContext.setIsOpen(false)
      // TODO: redirect to account page
    }
  }

  return (
    <>
      <h4>Log in To Your Sitka Seafood Member Portal</h4>
      <h5>Track orders and manage your<br /> subscription in your account.</h5>
      <form onSubmit={(e) => onSubmit(e)}>
        {showErrorMessage &&
          <p className={classes.modalFormError}>{errorMessage}</p>
        }
        <div className="input-group">
          <input type="email" className="input" placeholder="email address" ref={emailRef} />
        </div>
        <div className="input-group">
          <input type="password" className="input" placeholder="password" ref={passwordRef} />
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

export default LoginAccountForm