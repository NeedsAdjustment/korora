import { useState } from 'react'
import classNames from 'classnames'
import type { GalleryImage } from '@/lib/gallery'

export default function ProgressiveImage({
  image,
  className,
  alt = '',
}: {
  image: GalleryImage
  className?: string
  alt?: string
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full h-full">
      <img
        src={image.blurDataURL}
        aria-hidden="true"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-contain blur-xl"
      />
      <img
        src={image.src}
        width={image.width ?? undefined}
        height={image.height ?? undefined}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={classNames(
          'relative z-10 transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </div>
  )
}
