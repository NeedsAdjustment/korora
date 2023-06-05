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
  } else {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <span className='loading loading-infinity loading-lg' />
      </div>
    )
  }
}

export default Dashboard
