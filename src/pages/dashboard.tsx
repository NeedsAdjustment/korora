import { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { dashboardText, letter } from '@/utils/motionText'
import Penguins from '../../public/penguins.svg'
import { useCallback, useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'
import Map, { MapRef, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import slides from '@/utils/slides'
import useEmblaCarousel from 'embla-carousel-react'
import { prisma } from '../prisma'
import { useForm } from 'react-hook-form'
import { IRSVP, rsvpSchema } from './api/validation'
import { zodResolver } from '@hookform/resolvers/zod'
declare global {
  interface Window {
    modal: any
  }
}

export async function getServerSideProps() {
  const rsvps = await prisma.user.findMany({
    select: {
      firstName: true,
      lastName: true,
      RSVP: true,
      RSVPOthersYes: true,
      RSVPOthersNo: true,
    },
  })
  const gifts = await prisma.gift.findMany({
    select: {
      id: true,
      name: true,
      link: true,
    },
  })
  return {
    props: {
      rsvps,
      gifts,
    },
  }
}

const Dashboard: NextPage<any> = ({ rsvps, gifts }) => {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
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

  const [index, setIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: true, startIndex: index })
  const [emblaModalRef, emblaModalApi] = useEmblaCarousel({ loop: true, skipSnaps: true, startIndex: index })

  let rsvp = rsvps.map((rsvp) => {
    if (rsvp.firstName == session?.user?.firstName && rsvp.lastName == session?.user?.lastName) {
      return rsvp
    }
  })
  rsvp = rsvp.filter((item) => item !== undefined)[0]

  const { register, handleSubmit, reset } = useForm<IRSVP>({
    resolver: zodResolver(rsvpSchema),
  })

  const [rsvpLoading, setRSVPLoading] = useState(false)
  const [othersRSVP, setOthersRSVP] = useState(false)
  const [rsvped, setRSVPed] = useState(false)
  const [fieldsDisabled, setFieldsDisabled] = useState(false)
  const [rsvpSent, setRSVPSent] = useState(false)

  useEffect(() => {
    if (rsvpSent) {
      setOthersRSVP(true)
      setRSVPed(true)
      setFieldsDisabled(true)
    } else if (rsvp?.RSVP === true || rsvp?.RSVP === false) {
      reset({
        firstName: session?.user?.firstName,
        lastName: session?.user?.lastName,
        RSVP: rsvp?.RSVP ? true : false,
        RSVPOthersYes: rsvp?.RSVPOthersYes,
        RSVPOthersNo: rsvp?.RSVPOthersNo,
        RSVPDate: new Date(),
      })
      if (rsvp?.RSVPOthersYes || rsvp?.RSVPOthersNo) {
        setOthersRSVP(true)
        setRSVPed(true)
      }
      setFieldsDisabled(true)
    } else {
      reset({
        firstName: session?.user?.firstName,
        lastName: session?.user?.lastName,
        RSVPOthersYes: rsvp?.RSVPOthersYes,
        RSVPOthersNo: rsvp?.RSVPOthersNo,
        RSVPDate: new Date(),
      })
    }
  }, [rsvp, rsvpSent])

  const onSubmit = async (data) => {
    setRSVPLoading(true)
    try {
      await fetch('api/updateRSVP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error(error)
    }
    setRSVPLoading(false)
    setRSVPSent(true)
  }

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollPrevModal = useCallback(() => {
    if (emblaModalApi) emblaModalApi.scrollPrev()
  }, [emblaModalApi])

  const scrollNextModal = useCallback(() => {
    if (emblaModalApi) emblaModalApi.scrollNext()
  }, [emblaModalApi])

  const onSettle = useCallback((emblaApi) => {
    if (emblaApi) setIndex(emblaApi.selectedScrollSnap())
  }, [])

  const onSettleModal = useCallback((emblaModalApi) => {
    if (emblaModalApi) setIndex(emblaModalApi.selectedScrollSnap())
  }, [])

  const onInit = useCallback((emblaApi) => {
    emblaApi.scrollTo(index)
  }, [])

  const onModalInit = useCallback((emblaModalApi) => {
    emblaModalApi.scrollTo(index)
  }, [])

  useEffect(() => {
    if (emblaApi) emblaApi.on('init', onInit)
  }, [emblaApi, onInit])

  useEffect(() => {
    if (emblaModalApi) emblaModalApi.on('init', onModalInit)
  }, [emblaModalApi, onModalInit])

  useEffect(() => {
    if (emblaApi) emblaApi.on('settle', onSettle)
  }, [emblaApi, onSettle])

  useEffect(() => {
    if (emblaModalApi) emblaModalApi.on('settle', onSettleModal)
  }, [emblaModalApi, onSettleModal])

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
      <div data-theme='green' className='flex min-w-[360px] overflow-x-hidden font-body font-light text-neutral text-lg tracking-wide'>
        <main className='flex flex-col items-center min-w-[360px] h-[calc(100dvh)] w-screen px-8 lg:my-0'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className='mt-9 mb-10 font-display font-bold text-base hidden sm:block'
          >
            {countdown}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className='mt-7 mb-10 font-display font-bold text-base block sm:hidden'
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
            className='justify-center text-center max-w-[85vw] min-w-[296px] font-heading font-light tracking-wide text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4'
          >
            {'Hi, '.split('').map((char, index) => {
              return (
                <motion.span key={char + '-' + index} variants={letter}>
                  {char}
                </motion.span>
              )
            })}
            <span className='font-medium'>
              {session.user.firstName.split('').map((char, index) => {
                return (
                  <motion.span key={char + '-' + index} variants={letter}>
                    {char}
                  </motion.span>
                )
              })}
            </span>
            <motion.span key={'!'} variants={letter}>
              !
            </motion.span>
          </motion.h1>
          <motion.div
            exit={{ opacity: 0, y: 20 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className='max-w-[900px] mb-10'
          >
            <ul className='menu menu-horizontal bg-base-200 text-accent rounded-box mt-6'>
              <li>
                <a
                  data-tip='Map'
                  className={'sm:tooltip tooltip-primary' + (openTab === 1 && ' active hover:bg-neutral')}
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
                  className={'sm:tooltip tooltip-primary' + (openTab === 2 && ' active hover:bg-neutral')}
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
                  className={'sm:tooltip tooltip-primary' + (openTab === 3 && ' active hover:bg-neutral')}
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
                  data-tip='Gifts'
                  className={'sm:tooltip tooltip-primary' + (openTab === 4 && ' active hover:bg-neutral')}
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
                  className={'sm:tooltip tooltip-primary' + (openTab === 5 && ' active hover:bg-neutral')}
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
          <div className='pb-9'>
            {openTab === 1 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex flex-col max-w-[700px] w-[85vw] min-w-[296px] min-h-[25em] bg-base-200 text-accent rounded-2xl xl-shadow'
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
                  style={{ display: 'flex', flex: 1, alignContent: 'right', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
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
            {openTab === 2 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex flex-col max-w-[700px] w-[85vw] min-w-[296px] bg-base-200 text-accent rounded-2xl xl-shadow'
              >
                <div className='join join-vertical w-full'>
                  <div className='collapse collapse-arrow join-item border border-base-100'>
                    <input type='radio' name='info' defaultChecked />
                    <div className='collapse-title text-xl font-medium'>Format</div>
                    <div className='collapse-content'>
                      <p className='text-center text-sm sm:text-base text-neutral'>
                        Ceremony → Refreshments →{' '}
                        <span className='whitespace-nowrap'>
                          Cake & Coffee → Photos{session.user.dinner && <span className='text-secondary'> → Dinner</span>}
                        </span>{' '}
                      </p>
                    </div>
                  </div>
                  <div className='collapse collapse-arrow join-item border border-base-100'>
                    <input type='radio' name='info' />
                    <div className='collapse-title text-xl font-medium'>Alcohol</div>
                    <div className='collapse-content'>
                      <p className='text-sm sm:text-base text-neutral'>
                        We're having a dry wedding! Non-alcoholic refreshments will be available after the ceremony.
                      </p>
                    </div>
                  </div>
                  <div className='collapse collapse-arrow join-item border border-base-100'>
                    <input type='radio' name='info' />
                    <div className='collapse-title text-xl font-medium'>Dress Code</div>
                    <div className='collapse-content'>
                      <p className='text-sm sm:text-base text-neutral'>Semi-formal/Cocktail 🍸</p>
                    </div>
                  </div>
                  {session.user.dinner && (
                    <div className='collapse collapse-arrow join-item border border-base-100'>
                      <input type='radio' name='info' />
                      <div className='collapse-title text-xl font-medium text-secondary'>Dinner</div>
                      <div className='collapse-content'>
                        <p className='text-center md:text-left text-sm sm:text-base text-neutral'>
                          You're invited to our exclusive <span className='whitespace-nowrap'>family-&-friends reception dinner!</span>
                          <br />
                          <b>6:30pm in The Barn @ Pohangina Heights</b>
                        </p>
                      </div>
                    </div>
                  )}
                  <div className='collapse collapse-arrow join-item border border-base-100'>
                    <input type='radio' name='info' />
                    <div className='collapse-title text-xl font-medium'>Contact</div>
                    <div className='collapse-content'>
                      <div className='text-sm sm:text-base text-neutral'>
                        Just DM one of us (
                        <div className='tooltip' data-tip='josh'>
                          <a
                            className='link link-primary'
                            href={process.env.NEXT_PUBLIC_FB_LINKS.split(' ')[0]}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            face
                          </a>
                        </div>
                        •
                        <div className='tooltip' data-tip='em'>
                          <a
                            className='link link-primary'
                            href={process.env.NEXT_PUBLIC_FB_LINKS.split(' ')[1]}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            book
                          </a>
                        </div>{' '}
                        or{' '}
                        <div className='tooltip' data-tip='josh'>
                          <a
                            className='link link-primary'
                            href={process.env.NEXT_PUBLIC_INSTA_LINKS.split(' ')[0]}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            insta
                          </a>
                        </div>
                        •
                        <div className='tooltip' data-tip='em'>
                          <a
                            className='link link-primary'
                            href={process.env.NEXT_PUBLIC_INSTA_LINKS.split(' ')[1]}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            gram
                          </a>
                        </div>
                        ), or{' '}
                        <div className='tooltip' data-tip='us@korora.wedding'>
                          <a className='link link-primary' href={'mailto:' + process.env.NEXT_PUBLIC_EMAIL} target='_blank' rel='noopener noreferrer'>
                            email
                          </a>
                        </div>{' '}
                        here.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {openTab === 3 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex flex-col max-w-[700px] w-[85vw] min-w-[296px] py-8 bg-base-200 text-accent rounded-2xl xl-shadow'
              >
                <p className={'mx-5 mb-5 justify-center font-medium text-xl text-center tracking-wide' + (fieldsDisabled ? '' : ' hidden')}>
                  Thank you for RSVPing!
                </p>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='false' className='flex flex-1 items-center justify-center'>
                  <motion.div layout className='form-control'>
                    <input {...register('firstName')} type='hidden' />
                    <input {...register('lastName')} type='hidden' />
                    <div className='flex flex-row items-center gap-2 sm:gap-3 w-[75vw] max-w-[575px] min-w-[270px] mb-3'>
                      <p>1.</p>
                      <select
                        {...register('RSVP')}
                        onChange={() => setRSVPed(true)}
                        className='select select-bordered md:select-lg flex-grow'
                        disabled={fieldsDisabled}
                      >
                        <option disabled selected className={'' + (rsvped ? ' hidden' : '')}>
                          Confirm your attendance
                        </option>
                        <option value='true'>I'll be there!</option>
                        <option value='false'>I won't be able to make it.</option>
                      </select>
                    </div>
                    <div className={'flex flex-row gap-2 sm:gap-3 w-[75vw] max-w-[575px] min-w-[270px] mb-3' + (rsvped ? '' : ' hidden')}>
                      <p className='leading-[40px] md:leading-[48px]'>2.</p>
                      <div className='flex-col w-full'>
                        <div className='flex-row label cursor-pointer mb-3'>
                          <span className='label-text text-xs sm:text-sm md:text-base'>I'm RSVPing on behalf of others</span>
                          <input
                            type='checkbox'
                            checked={othersRSVP}
                            className='checkbox ml-auto md:checkbox-lg'
                            onClick={() => setOthersRSVP(!othersRSVP)}
                            disabled={fieldsDisabled}
                          />
                        </div>
                        <div className={'flex flex-row items-center gap-2 sm:gap-3 mb-3' + (othersRSVP ? '' : ' hidden')}>
                          <p>a.</p>
                          <input
                            {...register('RSVPOthersYes')}
                            className={'input input-bordered md:input-lg flex-grow' + (othersRSVP ? '' : ' hidden')}
                            type='text'
                            placeholder='Who is attending?'
                            defaultValue={rsvp.RSVPOthersYes === null ? '' : rsvp.RSVPOthersYes}
                            disabled={fieldsDisabled}
                          />
                        </div>
                        <div className={'flex flex-row items-center gap-2 sm:gap-3 mb-3' + (othersRSVP ? '' : ' hidden')}>
                          <p>b.</p>
                          <input
                            {...register('RSVPOthersNo')}
                            className='input input-bordered md:input-lg flex-grow'
                            type='text'
                            placeholder='Who is not attending?'
                            defaultValue={rsvp.RSVPOthersNo === null ? '' : rsvp.RSVPOthersNo}
                            disabled={fieldsDisabled}
                          />
                        </div>
                      </div>
                    </div>
                    <input {...register('RSVPDate')} type='hidden' />
                    <button
                      className={'btn btn-secondary mt-2 font-display font-bold tracking-wider' + (rsvped ? '' : ' hidden')}
                      type='submit'
                      disabled={fieldsDisabled}
                    >
                      {(rsvpLoading && <span className='loading loading-infinity loading-sm'></span>) || 'RSVP'}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}
            {openTab === 4 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex justify-center items-center max-w-[700px] w-[85vw] min-w-[296px] min-h-[25em] bg-base-200 text-accent rounded-2xl xl-shadow'
              >
                <p className='font-medium text-xl text-center tracking-wide'>gift registry coming soon</p>
              </motion.div>
            )}
            {openTab === 5 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex flex-col max-w-[700px] w-[85vw] min-w-[296px] min-h-[28.6em] max-h-[450px] bg-base-200 text-accent rounded-2xl xl-shadow'
              >
                <div className='flex overflow-hidden bg-neutral center-items rounded-2xl' ref={emblaRef}>
                  <div className='flex'>
                    {slides.map((image, index) => (
                      <div className='flex-[0_0_100%]' key={index}>
                        <Image src={image} className='object-contain w-full h-full' placeholder='blur' alt={''} sizes='85vw' />
                      </div>
                    ))}
                  </div>
                </div>
                <dialog id='modal' className='modal bg-black'>
                  <form method='dialog' className='flex flex-col items-center justify-center h-screen w-screen'>
                    <div className={'flex overflow-hidden bg-black center-items'} ref={emblaModalRef}>
                      <div className='flex'>
                        {slides.map((image, index) => (
                          <div className='flex-[0_0_100%]' key={index}>
                            <Image src={image} className='object-contain w-full h-full' placeholder='blur' alt={''} sizes='85vw' />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='fixed bottom-10 flex'>
                      <div className='btn btn-square btn-sm bg-base-100 mx-1' onClick={scrollPrevModal}>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 -960 960 960'>
                          <path xmlns='http://www.w3.org/2000/svg' d='M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z' />
                        </svg>
                      </div>
                      <button className='btn btn-square btn-sm bg-base-100 mx-1'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='currentColor' viewBox='0 -960 960 960'>
                          <path d='M147.333-100 100-147.333l139.334-139.334H120v-66.666h233.333V-120h-66.666v-119.334L147.333-100Zm665.334 0L673.333-239.334V-120h-66.666v-233.333H840v66.666H720.666L860-147.333 812.667-100ZM120-606.667v-66.666h119.334L100-812.667 147.333-860l139.334 139.334V-840h66.666v233.333H120Zm486.667 0V-840h66.666v119.334l140.001-140.001 47.333 47.333-140.001 140.001H840v66.666H606.667Z' />
                        </svg>
                      </button>
                      <div className='btn btn-square btn-sm bg-base-100 mx-1' onClick={scrollNextModal}>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 -960 960 960'>
                          <path xmlns='http://www.w3.org/2000/svg' d='m376-240-56-56 184-184-184-184 56-56 240 240-240 240Z' />
                        </svg>
                      </div>
                    </div>
                  </form>
                </dialog>
                <div className='flex justify-center items-center p-2'>
                  <button className='btn btn-square btn-sm bg-base-100 mx-1' onClick={scrollPrev}>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 -960 960 960'>
                      <path xmlns='http://www.w3.org/2000/svg' d='M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z' />
                    </svg>
                  </button>
                  <button className='btn btn-square btn-sm bg-base-100 mx-1' onClick={() => window.modal.showModal()}>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='currentColor' viewBox='0 -960 960 960'>
                      <path d='M120-120v-233.333h66.666v119.334L326.667-374 374-326.667 233.999-186.666h119.334V-120H120Zm486.667 0v-66.666h119.334L586.667-326 634-373.333l139.334 139.334v-119.334H840V-120H606.667ZM326-586.667 186.666-726.001v119.334H120V-840h233.333v66.666H233.999L373.333-634 326-586.667Zm308 0L586.667-634l139.334-139.334H606.667V-840H840v233.333h-66.666v-119.334L634-586.667Z' />
                    </svg>
                  </button>
                  <button className='btn btn-square btn-sm bg-base-100 mx-1' onClick={scrollNext}>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 -960 960 960'>
                      <path xmlns='http://www.w3.org/2000/svg' d='m376-240-56-56 184-184-184-184 56-56 240 240-240 240Z' />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className='fixed top-0 pl-6 pt-4 sm:px-8 sm:py-6 font-display '
        >
          <button
            className='btn text-xs w-[100px] sm:text-sm sm:w-[110px] bg-opacity-80'
            onClick={() => {
              setLoading(true)
              signOut()
            }}
          >
            {loading ? <span className='loading loading-infinity' /> : 'Log Out'}
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className='fixed top-0 right-0 pr-6 pt-4 sm:px-8 sm:py-6 font-display'
        >
          <div className='flex-none'>
            <button className='btn text-xs w-[100px] sm:text-sm sm:w-[110px] bg-opacity-80' onClick={() => setOpenTab(3)}>
              Confirm
            </button>
          </div>
        </motion.div>
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
