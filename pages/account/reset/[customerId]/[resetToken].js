import ResetPasswwordForm from "@/components/Forms/ResetPasswordForm"
import classes from '@/styles/pages/AccountFormPage.module.scss'

const ResetPassword = ({customerId, resetToken}) => {

  return (
    <div className={classes['account-form-page']}>
      <div className={classes['account-form-page__form']}>
        <ResetPasswwordForm customerId={customerId} resetToken={resetToken}  />
      </div>
    </div>
  )
}

export async function getServerSideProps({ params }) {

  const { customerId, resetToken } = params

  return {
    props: {
      customerId,
      resetToken
    }
  }
}


export default ResetPassword