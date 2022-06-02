import { useRef, useReducer } from 'react'
import { useCustomerContext } from '@/context/CustomerContext'
import { accountFormReducer, initialState } from '@/utils/account'
import classes from './AccountForm.module.scss'

const ResetPasswwordForm = ({ customerId, resetToken}) => {

  const customerContext = useCustomerContext()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const [state, dispatch] = useReducer(accountFormReducer, initialState)
  const { showSuccessMessage, showErrorMessage, errorMessage, isLoading} = state

  const onSubmit = async (e) => {
    e.preventDefault()

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      dispatch({ type: 'error', payload: 'Passwords do not match' })
      return
    }

    dispatch({ type: 'loading' })
    const response = await customerContext.reset({
      password: passwordRef.current.value,
      resetToken,
      customerId
    })

    if (response.errors?.length) {
      console.log(response)
      dispatch({ type: 'error', payload: response.errors[0].message })
    } else {
      if (response) {
        passwordRef.current.value = ''
        confirmPasswordRef.current.value = ''
        dispatch({ type: 'success' })
      }
    }
  }

  return (
    <div className={classes['account-form']}>
      <h4>Reset Password</h4>
      <h5>Enter a new account password.</h5>
      <form onSubmit={(e) => onSubmit(e)}>
        {showErrorMessage &&
          <p className={classes['account-form__error']}>{errorMessage}</p>
        }
        {showSuccessMessage &&
          <p className={classes['account-form__error']}>{`You're all set! Please login to continue`}</p>
        }
        <div className="input-group">
          <input type="password" className="input" placeholder="new password" ref={passwordRef} />
        </div>
        <div className="input-group">
          <input type="password" className="input" placeholder="confirm new password" ref={confirmPasswordRef} />
        </div>
        <button className="btn sitkablue" disabled={isLoading}>Reset Password</button>
      </form>
    </div>
  )
}

export default ResetPasswwordForm