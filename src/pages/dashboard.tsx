import { NextPage } from 'next'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { dashboardText, letter } from '@/utils/motionText'
import Penguins from '../../public/penguins.svg'
import { useCallback, useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'
import Map, { MapRef, Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession()

  const mapRef = useRef<MapRef>()
  const [zoomed, setZoomed] = useState(false)
  const handleZoom = () => {
    if (!zoomed) {
      mapRef.current?.flyTo({
        center: [parseFloat(process.env.NEXT_PUBLIC_MAP_COORDS.split(',')[1]), parseFloat(process.env.NEXT_PUBLIC_MAP_COORDS.split(',')[0])],
        zoom: 9,
        duration: 2000,
      })
    } else {
      mapRef.current?.flyTo({
        center: [parseFloat(process.env.NEXT_PUBLIC_COUNTRY_COORDS.split(',')[1]), parseFloat(process.env.NEXT_PUBLIC_COUNTRY_COORDS.split(',')[0])],
        zoom: 3.5,
        duration: 2000,
      })
    }
    setZoomed(!zoomed)
  }

  const [countdown, setCountdown] = useState('Countdown')
  const [smallCountdown, setSmallCountdown] = useState('Countdown')

  const weddingDate = new Date(process.env.NEXT_PUBLIC_DATE)
  const formattedDate = weddingDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toLowerCase()
  const formattedDayNum = weddingDate.toLocaleDateString('en-GB', { day: 'numeric' })
  const formattedDay = weddingDate.toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase()
  const formattedTime = (parseInt(weddingDate.toLocaleTimeString('en-GB', { hour: 'numeric' })) % 12 || 12) + " o'clock"

  useEffect(() => {
    const targetDate = weddingDate.getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance <= 0) {
        clearInterval(interval)
        setCountdown("It's here!")
        setSmallCountdown("It's here!")
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
      <div data-theme='green' className='flex overflow-x-hidden items-center font-body font-light text-neutral text-lg tracking-wide'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className='navbar fixed top-0 px-8 py-6 font-display'
        >
          <div className='flex-1'>
            <button className='btn w-[110px]' onClick={() => signOut()}>
              Log Out
            </button>
          </div>
          <div className='flex-none'>
            <button className='btn w-[110px]'>Confirm</button>
          </div>
        </motion.div>
        <main className='flex flex-col items-center h-[calc(100dvh)] min-w-[360px] min-h-[750px] w-screen px-8 lg:my-0'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className='mt-[2.25em] mb-10 font-display font-bold text-base hidden sm:block'
          >
            {countdown}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className='mt-[2.25em] mb-10 font-display font-bold text-base block sm:hidden'
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
            className='justify-center max-w-[85vw] font-heading font-light tracking-wide text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-10'
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
            className='flex flex-col max-w-[700px] w-[85vw] min-h-[25em] mb-20 bg-base-200 text-accent rounded-2xl xl-shadow'
          >
            <Map
              ref={mapRef}
              reuseMaps
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              mapLib={import('mapbox-gl')}
              initialViewState={{
                latitude: parseFloat(process.env.NEXT_PUBLIC_COUNTRY_COORDS.split(',')[0]),
                longitude: parseFloat(process.env.NEXT_PUBLIC_COUNTRY_COORDS.split(',')[1]),
                zoom: 3.5,
              }}
              style={{ zIndex: 100, display: 'flex', flex: 1, alignContent: 'right', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
              mapStyle='mapbox://styles/spren/clikciyg5000001q447fchmm7'
              dragRotate={false}
              touchPitch={false}
            >
              <Marker
                color='#31553d'
                latitude={parseFloat(process.env.NEXT_PUBLIC_MARKER_COORDS.split(',')[0])}
                longitude={parseFloat(process.env.NEXT_PUBLIC_MARKER_COORDS.split(',')[1])}
                anchor='bottom'
              ></Marker>
              <label className='btn btn-circle absolute top-0 right-0 m-2 btn-neutral swap swap-rotate'>
                <input type='checkbox' onChange={handleZoom} />
                <svg className='swap-off fill-current w-5' xmlns='http://www.w3.org/2000/svg' height='40' viewBox='0 -960 960 960' width='40'>
                  <path d='M147.333-100 100-147.333l139.334-139.334H120v-66.666h233.333V-120h-66.666v-119.334L147.333-100Zm665.334 0L673.333-239.334V-120h-66.666v-233.333H840v66.666H720.666L860-147.333 812.667-100ZM120-606.667v-66.666h119.334L100-812.667 147.333-860l139.334 139.334V-840h66.666v233.333H120Zm486.667 0V-840h66.666v119.334l140.001-140.001 47.333 47.333-140.001 140.001H840v66.666H606.667Z' />
                </svg>
                <svg className='swap-on fill-current w-5' xmlns='http://www.w3.org/2000/svg' height='40' viewBox='0 -960 960 960' width='40'>
                  <path d='M120-120v-233.333h66.666v119.334L326.667-374 374-326.667 233.999-186.666h119.334V-120H120Zm486.667 0v-66.666h119.334L586.667-326 634-373.333l139.334 139.334v-119.334H840V-120H606.667ZM326-586.667 186.666-726.001v119.334H120V-840h233.333v66.666H233.999L373.333-634 326-586.667Zm308 0L586.667-634l139.334-139.334H606.667V-840H840v233.333h-66.666v-119.334L634-586.667Z' />
                </svg>
              </label>
            </Map>
            <div>
              <h2 className='mx-5 pt-5 justify-center font-medium text-xl text-center tracking-wide'>
                {process.env.NEXT_PUBLIC_VENUE.toLowerCase()}
                <span className='hidden sm:inline'> • </span>
                <br className='sm:hidden'></br>
                {process.env.NEXT_PUBLIC_LOCATION.toLowerCase()}
              </h2>
              <p className='mx-5 mb-5 justify-center font-medium text-xl text-center tracking-wide'>
                {formattedDayNum}
                <sup>Þ </sup>
                {formattedDate}
                <span className='hidden sm:inline'> • </span>
                <br className='sm:hidden' />
                {formattedDay + ' ' + formattedTime}
              </p>
            </div>
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
