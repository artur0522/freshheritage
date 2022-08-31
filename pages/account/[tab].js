import AccountMainPage from '@/components/Account/AccountMainPage/AccountMainPage'
import { MemberAccountContextProvider } from '@/context/MemberAccountContext'

const AccountTab = () => {
  return (
    <MemberAccountContextProvider>
      <AccountMainPage/>
    </MemberAccountContextProvider>
  )
}

export default AccountTab
