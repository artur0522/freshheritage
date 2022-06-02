import { useRef, useReducer } from 'react'
import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import { accountFormReducer, initialState } from '@/utils/account'
import classes from './AccountForm.module.scss'

const LoginAccountForm = () => {

  const modalContext = useModalContext()
  const customerContext = useCustomerContext()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [state, dispatch] = useReducer(accountFormReducer, initialState)
  const { showSuccessMessage, showErrorMessage, errorMessage, isLoading} = state

  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'loading' })
    const response = await customerContext.login({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    })
    if (response.errors?.length) {
      console.log(response)
      dispatch({ type: 'error', payload: response.errors[0].message })
    } else {
      emailRef.current.value = ''
      passwordRef.current.value = ''
      dispatch({ type: 'success' })
      modalContext.setIsOpen(false)
      // TODO: redirect to account page
    }
  }

  return (
    <div className={classes['account-form']}>
      <h4>Log in To Your Sitka Seafood Member Portal</h4>
      <h5>Track orders and manage your<br /> subscription in your account.</h5>
      <form onSubmit={(e) => onSubmit(e)}>
        {showErrorMessage &&
          <p className={classes['account-form__error']}>{errorMessage}</p>
        }
        <div className="input-group">
          <input type="email" className="input" placeholder="email address" ref={emailRef} />
        </div>
        <div className="input-group">
          <input type="password" className="input" placeholder="password" ref={passwordRef} />
        </div>
        <button className="btn sitkablue" disabled={isLoading}>Login</button>
      </form>
      <p>
        <button
          onClick={() => modalContext.setModalType('forgot_password')}
          className="btn-link-underline">
            Forgot Password?
        </button>
      </p>
      <p>{`Don't have an account? `}
        <button
          onClick={() => modalContext.setModalType('create')}
          className="btn-link-underline">
            Sign Up
        </button>
      </p>
    </div>
  )
}

export default LoginAccountForm