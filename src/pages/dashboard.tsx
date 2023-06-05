import { NextPage } from 'next'
import { useSession } from 'next-auth/react'

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession()

  if (status === 'authenticated') {
    return (
      <>
        <p>Hi {session?.user.name}</p>
      </>
    )
  }
}

export default Dashboard
