import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function Countdown({ date }: { date: Date }) {
  const [countdown, setCountdown] = useState('Countdown')
  const [smallCountdown, setSmallCountdown] = useState('Countdown')

  useEffect(() => {
    const targetDate = date.getTime()

    const interval = setInterval(() => {
      const distance = targetDate - Date.now()

      if (distance <= 0) {
        clearInterval(interval)
        setCountdown("It's here!")
        setSmallCountdown("It's here!")
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      setSmallCountdown(`${days}d ${hours}h`)
    }, 1000)

    return () => clearInterval(interval)
  }, [date])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-9 mb-10 font-display font-bold text-base hidden sm:block"
      >
        {countdown}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-7 mb-10 font-display font-bold text-base block sm:hidden"
      >
        {smallCountdown}
      </motion.div>
    </>
  )
}
