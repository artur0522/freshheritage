import { useRef, useReducer } from 'react'
import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import { accountFormReducer, initialState } from '@/utils/account'
import classes from './AccountForm.module.scss'

const ForgotPasswordForm = () => {

  const modalContext = useModalContext()
  const customerContext = useCustomerContext()
  const emailRef = useRef()
  const [state, dispatch] = useReducer(accountFormReducer, initialState)
  const { showSuccessMessage, showErrorMessage, errorMessage, isLoading} = state

  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'loading' })
    const response = await customerContext.recover({
      email: emailRef.current.value,
    })

    if (response.errors?.length) {
      console.log(response)
      dispatch({ type: 'error', payload: response.errors[0].message })
    } else {
      if (response) {
        console.log("response:", response)
        emailRef.current.value = ''
        dispatch({ type: 'success' })
      }
    }
  }

  return (
    <div className={classes['account-form']}>
      <h4>Forgot Your<br />Password?</h4>
      <h5>{`Enter the email address associated with your account and we'll email you a link to reset your password.`}</h5>
      <form onSubmit={(e) => onSubmit(e)}>
        {showErrorMessage &&
          <p className={classes['account-form__error']}>{errorMessage}</p>
        }
        {showSuccessMessage &&
          <p className={classes['account-form__error']}>Email sent! Please check your inbox.</p>
        }
        <div className="input-group">
          <input type="email" className="input" placeholder="email" ref={emailRef} />
        </div>
        <button className="btn sitkablue" disabled={isLoading}>Submit</button>
      </form>
      <p>{`Have an account? `}
        <button
          onClick={() => modalContext.setModalType('login')}
          className="btn-link-underline">
            Log In
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

export default ForgotPasswordForm