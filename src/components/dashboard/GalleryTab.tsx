import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'motion/react'
import ProgressiveImage from '@/components/ProgressiveImage'
import { gallery } from '@/lib/gallery'

export default function GalleryTab() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: true })
  const [emblaModalRef, emblaModalApi] = useEmblaCarousel({ loop: true, skipSnaps: true })

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const scrollPrevModal = useCallback(() => {
    emblaModalApi?.scrollPrev()
  }, [emblaModalApi])

  const scrollNextModal = useCallback(() => {
    emblaModalApi?.scrollNext()
  }, [emblaModalApi])

  const openModal = () => {
    dialogRef.current?.showModal()
    emblaModalApi?.reInit()
    emblaModalApi?.scrollTo(selectedIndex, true)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col max-w-[700px] w-[85vw] min-w-[296px] min-h-[28.6em] max-h-[450px] bg-base-200 text-accent rounded-2xl"
    >
      <div className="flex overflow-hidden bg-neutral rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {gallery.map((image, index) => (
            <div className="flex-[0_0_100%]" key={index}>
              <ProgressiveImage image={image} className="object-contain w-full h-full" />
            </div>
          ))}
        </div>
      </div>
      <dialog ref={dialogRef} id="modal" className="modal bg-black">
        <form method="dialog" className="flex flex-col items-center justify-center h-screen w-screen">
          <div className="flex overflow-hidden bg-black" ref={emblaModalRef}>
            <div className="flex">
              {gallery.map((image, index) => (
                <div className="flex-[0_0_100%]" key={index}>
                  <ProgressiveImage image={image} className="object-contain w-full h-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="fixed bottom-10 flex">
            <button
              type="button"
              aria-label="Previous photo"
              className="btn btn-square btn-sm bg-base-100 mx-1"
              onClick={scrollPrevModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 -960 960 960">
                <path xmlns="http://www.w3.org/2000/svg" d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </svg>
            </button>
            <button type="submit" aria-label="Close photo" className="btn btn-square btn-sm bg-base-100 mx-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 -960 960 960">
                <path d="M147.333-100 100-147.333l139.334-139.334H120v-66.666h233.333V-120h-66.666v-119.334L147.333-100Zm665.334 0L673.333-239.334V-120h-66.666v-233.333H840v66.666H720.666L860-147.333 812.667-100ZM120-606.667v-66.666h119.334L100-812.667 147.333-860l139.334 139.334V-840h66.666v233.333H120Zm486.667 0V-840h66.666v119.334l140.001-140.001 47.333 47.333-140.001 140.001H840v66.666H606.667Z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              className="btn btn-square btn-sm bg-base-100 mx-1"
              onClick={scrollNextModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 -960 960 960">
                <path xmlns="http://www.w3.org/2000/svg" d="m376-240-56-56 184-184-184-184 56-56 240 240-240 240Z" />
              </svg>
            </button>
          </div>
        </form>
      </dialog>
      <div className="flex justify-center items-center p-2">
        <button type="button" aria-label="Previous photo" className="btn btn-square btn-sm bg-base-100 mx-1" onClick={scrollPrev}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 -960 960 960">
            <path xmlns="http://www.w3.org/2000/svg" d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
        </button>
        <button type="button" aria-label="Expand photo" className="btn btn-square btn-sm bg-base-100 mx-1" onClick={openModal}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 -960 960 960">
            <path d="M147.333-100 100-147.333l139.334-139.334H120v-66.666h233.333V-120h-66.666v-119.334L147.333-100Zm665.334 0L673.333-239.334V-120h-66.666v-233.333H840v66.666H720.666L860-147.333 812.667-100ZM120-606.667v-66.666h119.334L100-812.667 147.333-860l139.334 139.334V-840h66.666v233.333H120Zm486.667 0V-840h66.666v119.334l140.001-140.001 47.333 47.333-140.001 140.001H840v66.666H606.667Z" />
          </svg>
        </button>
        <button type="button" aria-label="Next photo" className="btn btn-square btn-sm bg-base-100 mx-1" onClick={scrollNext}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 -960 960 960">
            <path xmlns="http://www.w3.org/2000/svg" d="m376-240-56-56 184-184-184-184 56-56 240 240-240 240Z" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
