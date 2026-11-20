import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Navigate, useNavigate } from 'react-router-dom'
import AnimatedLetters from '@/components/AnimatedLetters'
import DatabaseNotice from '@/components/dashboard/DatabaseNotice'
import Countdown from '@/components/dashboard/Countdown'
import CoupleHeader from '@/components/dashboard/CoupleHeader'
import ErrorNotice from '@/components/dashboard/ErrorNotice'
import GalleryTab from '@/components/dashboard/GalleryTab'
import GiftsTab from '@/components/dashboard/GiftsTab'
import InfoTab from '@/components/dashboard/InfoTab'
import MapTab from '@/components/dashboard/MapTab'
import RsvpTab from '@/components/dashboard/RsvpTab'
import TabNav, { type TabId } from '@/components/dashboard/TabNav'
import LoadingScreen from '@/components/LoadingScreen'
import { ApiError } from '@/lib/api'
import { signOut } from '@/lib/auth-client'
import { siteConfig } from '@/lib/config'
import { useGifts, useMe } from '@/lib/queries'
import { dashboardText, letter } from '@/utils/motionText'

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const me = useMe()
  const gifts = useGifts()
  const [openTab, setOpenTab] = useState<TabId>(1)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    queryClient.clear()
    navigate('/', { replace: true })
  }

  if (me.isPending || gifts.isPending) return <LoadingScreen />

  const error = me.error ?? gifts.error

  if (error) {
    if (error instanceof ApiError && error.status === 401) return <Navigate to="/" replace />
    if (error instanceof ApiError && error.status === 503) return <DatabaseNotice />

    return (
      <ErrorNotice
        message={error.message}
        onRetry={() => {
          void me.refetch()
          void gifts.refetch()
        }}
      />
    )
  }

  if (!me.data || !gifts.data) return <DatabaseNotice />

  const user = me.data.user

  return (
    <div
      data-theme="green"
      className="flex min-w-[360px] overflow-x-hidden font-body font-light text-neutral text-lg tracking-wide"
    >
      <main className="flex flex-col items-center min-w-[360px] h-[calc(100dvh)] w-screen px-8 lg:my-0">
        <Countdown date={siteConfig.weddingDate} />
        <CoupleHeader />
        <motion.h1
          variants={dashboardText}
          initial="hidden"
          animate="visible"
          className="justify-center text-center max-w-[85vw] min-w-[296px] font-heading font-light tracking-wide text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4"
        >
          <AnimatedLetters text="Hi, " />
          <span className="font-medium">
            <AnimatedLetters text={user.firstName} />
          </span>
          <motion.span key={'!'} variants={letter}>
            !
          </motion.span>
        </motion.h1>
        <TabNav openTab={openTab} onChange={setOpenTab} />
        <div className="pb-9">
          {openTab === 1 && <MapTab />}
          {openTab === 2 && <InfoTab user={user} />}
          {openTab === 3 && <RsvpTab key={user.rsvp.updatedAt ?? 'new'} user={user} />}
          {openTab === 4 && <GiftsTab gifts={gifts.data.gifts} />}
          {openTab === 5 && <GalleryTab />}
        </div>
      </main>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed top-0 pl-6 pt-4 sm:px-8 sm:py-6 font-display "
      >
        <button
          className="btn text-xs w-[100px] sm:text-sm sm:w-[110px] bg-base-200/80 border-base-200 leading-5"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? <span className="loading loading-infinity" /> : 'Log Out'}
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed top-0 right-0 pr-6 pt-4 sm:px-8 sm:py-6 font-display"
      >
        <div className="flex-none">
          <button
            className="btn text-xs w-[100px] sm:text-sm sm:w-[110px] bg-base-200/80 border-base-200 leading-5"
            onClick={() => setOpenTab(3)}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  )
}
