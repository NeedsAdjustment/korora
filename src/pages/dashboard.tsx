import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession()
  const phrase = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0,
        staggerChildren: 0.08,
      },
    },
  }
  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  if (status === 'authenticated') {
    return (
      <div data-theme='green'>
        <main className='flex items-center justify-center h-[calc(100dvh)] font-body tracking-wide min-w-[360px] min-h-[750px] px-8 my-8 lg:my-0'>
          <motion.h1 variants={phrase} initial='hidden' animate='visible' className='justify-center font-heading font-light tracking-wide text-8xl'>
            {'Hi, '.split('').map((char, index) => {
              return (
                <motion.span key={char + '-' + index} variants={letter}>
                  {char}
                </motion.span>
              )
            })}
            <span className='font-medium'>
              {session?.user.name
                .split(' ')[0]
                .split('')
                .map((char, index) => {
                  return (
                    <motion.span key={char + '-' + index} variants={letter}>
                      {char}
                    </motion.span>
                  )
                })}
            </span>
            {'!'.split('').map((char, index) => {
              return (
                <motion.span key={char + '-' + index} variants={letter}>
                  {char}
                </motion.span>
              )
            })}
          </motion.h1>
        </main>
      </div>
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
