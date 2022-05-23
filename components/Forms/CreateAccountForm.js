import { useRef, useState } from 'react'
import { useModalContext } from '@/context/ModalContext'
import { useCustomerContext } from '@/context/CustomerContext'
import classes from '@/components/Layout/Modal/Modal.module.scss'

const CreateAccountForm = () => {

  const modalContext = useModalContext()
  const customerContext = useCustomerContext()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const response = await customerContext.register({
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    })

    if (response.errors?.length) {
      console.log(response)
      setShowErrorMessage(true)
      setErrorMessage(response.errors[0].message)
      setIsLoading(true)
    } else {
      const response = await customerContext.login({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })

      if (response) {
        firstNameRef.current.value = ''
        lastNameRef.current.value = ''
        emailRef.current.value = ''
        passwordRef.current.value = ''
        modalContext.setIsOpen(false)
        setIsLoading(true)
        setShowErrorMessage('')
        // TODO: redirect to account page
      }
    }
  }


  return (
    <>
      <h4>Create A Sitka Seafood Membership Account</h4>
      <h5>Track orders and manage your<br/> subscription in your account.</h5>
      <form onSubmit={(e) => onSubmit(e)}>
        {showErrorMessage &&
          <p className={classes.modalFormError}>{errorMessage}</p>
        }
        <div className="input-group">
          <input type="text" className="input" placeholder="first name" ref={firstNameRef} />
        </div>
        <div className="input-group">
          <input type="text" className="input" placeholder="last name" ref={lastNameRef} />
        </div>
        <div className="input-group">
          <input type="email" className="input" placeholder="email" ref={emailRef} />
        </div>
        <div className="input-group">
          <input type="password" className="input" placeholder="password" ref={passwordRef} />
        </div>
        <button className="btn sitkablue" disabled={isLoading}>Create Account</button>
      </form>
      <p>Already a member?&nbsp;
        <button
          onClick={() => modalContext.setModalType('login')}
          className="btn-link-underline">
            Log In
        </button>
      </p>
    </>
  )
}

export default CreateAccountForm;