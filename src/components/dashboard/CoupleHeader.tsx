import { motion } from 'motion/react'

export default function CoupleHeader() {
  return (
    <>
      <div className="relative flex items-center justify-center w-full h-fit">
        <motion.div
          className="absolute flex items-center justify-center w-[30%] mt-4 sm:mt-8 md:mt-9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img className="w-full max-w-[13em]" fetchPriority="high" src="/penguins.svg" alt="Penguins" />
        </motion.div>
        <motion.svg className="max-h-[20em] w-full" viewBox="0 0 2778 1400" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              ease: 'easeInOut',
            }}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray="0 1"
            fill="none"
            stroke="#fff"
            d="M424.691,1383.09c-0,0 -409.529,0 -409.541,0c58.584,-330.212 192.999,-625.431 379.467,-856.224c254.593,-315.113 606.221,-510.125 994.358,-510.125c672.415,-0 1235.26,585.283 1373.83,1366.35c0,0 -407.892,0 -407.892,0"
          />
        </motion.svg>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="flex flex-wrap justify-center font-display font-medium text-xl text-center tracking-wider mb-10 mt-[-0.9em] mx-8 px-4 space-x-2 bg-base-100"
      >
        <div className="flex flex-row whitespace-nowrap space-x-2">
          <span>emily</span>
          <span className="hidden sm:block">yap</span>
          <span className="hidden md:block">juet yen</span>
        </div>
        <div>•</div>
        <div className="flex flex-row whitespace-nowrap space-x-2">
          <span>joshua</span> <span className="hidden md:block">james</span>
          <span className="hidden sm:block">soong</span>
        </div>
      </motion.div>
    </>
  )
}
