import { NextPage } from 'next'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { dashboardText, letter } from '@/utils/motionText'
import Penguins from '../../public/penguins.svg'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { parse } from 'path'

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession()

  const [countdown, setCountdown] = useState('Countdown')
  const [smallCountdown, setSmallCountdown] = useState('Countdown')

  useEffect(() => {
    const targetDate = new Date(process.env.NEXT_PUBLIC_DATE).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance <= 0) {
        clearInterval(interval)
        setCountdown("It's here!")
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        setSmallCountdown(`${days}d ${hours}h`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (status === 'authenticated') {
    return (
      <div data-theme='green' className='font-body font-light text-neutral text-lg tracking-wide'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className='navbar fixed top-0 px-10 py-8 font-display'
        >
          <div className='navbar-start'>
            <button className='btn' onClick={() => signOut()}>
              Log Out
            </button>
          </div>

          <div className='navbar-end'>
            <button className='btn'>RSVP</button>
          </div>
        </motion.div>
        <main className='flex flex-col items-center h-[calc(100dvh)] min-w-[360px] min-h-[750px] px-8 lg:my-0'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className='mt-[2.75em] mb-10 font-display font-bold text-base hidden sm:block'
          >
            {countdown}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className='mt-[2.75em] mb-10 font-display font-bold text-base block sm:hidden'
          >
            {smallCountdown}
          </motion.div>
          <div className='relative flex items-center justify-center w-full h-fit'>
            <motion.div
              className='absolute flex items-center justify-center w-[30%] mt-4 sm:mt-8 md:mt-9'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image className='w-full max-w-[13em]' priority src={Penguins} alt='Penguins' />
            </motion.div>
            <motion.svg className='max-h-[20em]' viewBox='0 0 2778 1400' xmlns='http://www.w3.org/2000/svg'>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                }}
                strokeWidth={12}
                strokeLinecap='round'
                strokeDasharray='0 1'
                fill='none'
                stroke='#fff'
                d='M424.691,1383.09c-0,0 -409.529,0 -409.541,0c58.584,-330.212 192.999,-625.431 379.467,-856.224c254.593,-315.113 606.221,-510.125 994.358,-510.125c672.415,-0 1235.26,585.283 1373.83,1366.35c0,0 -407.892,0 -407.892,0'
              />
            </motion.svg>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className='flex flex-wrap justify-center font-display font-medium text-xl text-center tracking-wider mb-10 mt-[-0.9em] mx-8 px-4 space-x-2 bg-base-100'
          >
            <div className='flex flex-row whitespace-nowrap space-x-2'>
              <span>emily</span>
              <span className='hidden sm:block'>yap</span>
              <span className='hidden md:block'>juet yen</span>
            </div>
            <div>•</div>
            <div className='flex flex-row whitespace-nowrap space-x-2'>
              <span>joshua</span> <span className='hidden md:block'>james</span>
              <span className='hidden sm:block'>soong</span>
            </div>
          </motion.div>
          <motion.h1
            variants={dashboardText}
            initial='hidden'
            animate='visible'
            className='justify-center font-heading font-light tracking-wide text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-10'
          >
            {'Hi, '.split('').map((char, index) => {
              return (
                <motion.span key={char + '-' + index} variants={letter}>
                  {char}
                </motion.span>
              )
            })}
            <span className='font-medium'>
              {session.user.name
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className='max-w-[900px] mb-10'
          >
            Location: {process.env.NEXT_PUBLIC_LOCATION}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className='max-w-[900px] mb-10'
          >
            <Map
              reuseMaps
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              mapLib={import('mapbox-gl')}
              initialViewState={{
                latitude: parseFloat(process.env.NEXT_PUBLIC_MAP_COORDS.split(',')[0]),
                longitude: parseFloat(process.env.NEXT_PUBLIC_MAP_COORDS.split(',')[1]),
                zoom: 10,
              }}
              style={{ width: 600, height: 600 }}
              mapStyle='mapbox://styles/spren/clikciyg5000001q447fchmm7'
            >
              <Marker
                color='#31553d'
                latitude={parseFloat(process.env.NEXT_PUBLIC_MARKER_COORDS.split(',')[0])}
                longitude={parseFloat(process.env.NEXT_PUBLIC_MARKER_COORDS.split(',')[1])}
                anchor='bottom'
              ></Marker>
            </Map>
          </motion.div>
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
