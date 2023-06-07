import { NextPage } from 'next'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'
import { dashboardText, letter } from '@/utils/motionText'
import Penguins from '../../public/penguins.svg'
import { useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'
import Map, { MapRef, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession()

  const [openTab, setOpenTab] = useState(1)

  const mapRef = useRef<MapRef>()
  const [zoomed, setZoomed] = useState(false)
  const handleZoom = () => {
    if (!zoomed) {
      mapRef.current?.flyTo({
        center: [parseFloat(process.env.NEXT_PUBLIC_MAP_COORDS.split(',')[1]), parseFloat(process.env.NEXT_PUBLIC_MAP_COORDS.split(',')[0])],
        zoom: 9,
        duration: 1000,
      })
    } else {
      mapRef.current?.flyTo({
        center: [parseFloat(process.env.NEXT_PUBLIC_COUNTRY_COORDS.split(',')[1]), parseFloat(process.env.NEXT_PUBLIC_COUNTRY_COORDS.split(',')[0])],
        zoom: 3.5,
        duration: 1000,
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
            className='justify-center max-w-[85vw] font-heading font-light tracking-wide text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4'
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
            <ul className='menu menu-horizontal bg-base-200 text-accent rounded-box mt-6'>
              <li>
                <a
                  data-tip='Map'
                  className={'tooltip tooltip-primary' + (openTab === 1 && ' active hover:bg-neutral')}
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenTab(1)
                  }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 -960 960 960'>
                    <path
                      xmlns='http://www.w3.org/2000/svg'
                      d='m598.5-130-237-83-180 70q-19 8-35.5-3.75t-16.5-32.184V-723.85q0-12.65 7.25-22.65 7.25-10 19.75-14.5l205-70 237 83 180-70q19-8 35.5 3.75t16.5 32.22v545.858q0 12.672-7.25 22.672T803.5-200l-205 70Zm-38-92v-461l-161-56v461l161 56Zm75 0 120-40v-467l-120 46v461Zm-431-10 120-46v-461l-120 40v467Zm431-451v461-461Zm-311-56v461-461Z'
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  data-tip='Info'
                  className={'tooltip tooltip-primary' + (openTab === 2 && ' active hover:bg-neutral')}
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenTab(2)
                  }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 -960 960 960'>
                    <path
                      xmlns='http://www.w3.org/2000/svg'
                      d='M443-285h75v-234h-75v234Zm36.895-311Q496-596 507-606.895q11-10.894 11-27Q518-650 507.105-661q-10.894-11-27-11Q464-672 453-661.105q-11 10.894-11 27Q442-618 452.895-607q10.894 11 27 11ZM480-90q-80.907 0-152.065-30.763-71.159-30.763-123.797-83.5Q151.5-257 120.75-328.087 90-399.175 90-480q0-80.907 30.763-152.065 30.763-71.159 83.5-123.797Q257-808.5 328.087-839.25 399.175-870 480-870q80.907 0 152.065 30.763 71.159 30.763 123.797 83.5Q808.5-703 839.25-631.913 870-560.825 870-480q0 80.907-30.763 152.065-30.763 71.159-83.5 123.797Q703-151.5 631.913-120.75 560.825-90 480-90Zm0-75q131.5 0 223.25-91.75T795-480q0-131.5-91.75-223.25T480-795q-131.5 0-223.25 91.75T165-480q0 131.5 91.75 223.25T480-165Zm0-315Z'
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  data-tip='RSVP'
                  className={'tooltip tooltip-primary' + (openTab === 3 && ' active hover:bg-neutral')}
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenTab(3)
                  }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 rotate-45' fill='currentColor' viewBox='0 -960 960 960'>
                    <path
                      xmlns='http://www.w3.org/2000/svg'
                      d='M480.438-169Q447-169 422.75-146T398.5-90h-115q-30.938 0-52.969-22.031Q208.5-134.062 208.5-165v-631q0-30.938 22.031-52.969Q252.562-871 283.5-871h115q0 33 24.25 56t57.688 23q33.438 0 57.25-23 23.812-23 23.812-56h115q30.938 0 52.969 22.031Q751.5-826.938 751.5-796v631q0 30.938-22.031 52.969Q707.438-90 676.5-90h-115q0-33-23.812-56t-57.25-23Zm-.032-75q42.594 0 78.344 21.25Q594.5-201.5 615.5-165h61v-631h-61q-21 36.5-56.871 57.75Q522.759-717 480.5-717q-42.629 0-78.815-21-36.185-21-57.185-58h-61v631h61q21-37 57.156-58 36.155-21 78.75-21ZM480-480.5Z'
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  className={'tooltip tooltip-primary' + (openTab === 4 && ' active hover:bg-neutral')}
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenTab(4)
                  }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 -960 960 960'>
                    <path
                      xmlns='http://www.w3.org/2000/svg'
                      d='M243.5-82.5q-30.938 0-52.969-22.031Q168.5-126.562 168.5-157.5v-473q0-30.938 22.031-52.969Q212.562-705.5 243.5-705.5h79q0-65 46.272-111t111.25-46q64.978 0 111.228 46.119Q637.5-770.263 637.5-705.5h79q30.938 0 52.969 22.031Q791.5-661.438 791.5-630.5v473q0 30.938-22.031 52.969Q747.438-82.5 716.5-82.5h-473Zm0-75h473v-473h-79v82.5q0 15.5-11 26.5t-26.5 11q-15.5 0-26.5-11t-11-26.5v-82.5h-165v82.5q0 15.5-11 26.5t-26.5 11q-15.5 0-26.5-11t-11-26.5v-82.5h-79v473Zm154-548h165q0-34-24.228-58t-58.25-24q-34.022 0-58.272 24.088-24.25 24.087-24.25 57.912Zm-154 548v-473 473Z'
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  data-tip='Us?'
                  className={'tooltip tooltip-primary' + (openTab === 5 && ' active hover:bg-neutral')}
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenTab(5)
                  }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 -960 960 960'>
                    <path
                      xmlns='http://www.w3.org/2000/svg'
                      d='M117.5-202.5q-30.938 0-52.969-22.031Q42.5-246.562 42.5-277.5v-405q0-30.938 22.031-52.969Q86.562-757.5 117.5-757.5h405q30.938 0 52.969 22.031Q597.5-713.438 597.5-682.5v405q0 30.938-22.031 52.969Q553.438-202.5 522.5-202.5h-405Zm602.5-320q-15.5 0-26.5-11t-11-26.5v-160q0-15.5 11-26.5t26.5-11h160q15.5 0 26.5 11t11 26.5v160q0 15.5-11 26.5t-26.5 11H720Zm37.5-75h85v-85h-85v85Zm-640 320h405v-405h-405v405Zm47.5-85h310L375-496l-75 100-55-73-80 106.5Zm555 160q-15.5 0-26.5-11t-11-26.5v-160q0-15.5 11-26.5t26.5-11h160q15.5 0 26.5 11t11 26.5v160q0 15.5-11 26.5t-26.5 11H720Zm37.5-75h85v-85h-85v85Zm-640 0v-405 405Zm640-320v-85 85Zm0 320v-85 85Z'
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </motion.div>
          <AnimatePresence>
            {openTab === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex flex-col max-w-[700px] w-[85vw] min-h-[25em] mb-20 bg-base-200 text-accent rounded-2xl xl-shadow transition-all-2'
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
            )}
          </AnimatePresence>
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
