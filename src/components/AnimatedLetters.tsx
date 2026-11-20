import { motion } from 'motion/react'
import { letter } from '@/utils/motionText'

export default function AnimatedLetters({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={letter}>
          {char}
        </motion.span>
      ))}
    </>
  )
}
