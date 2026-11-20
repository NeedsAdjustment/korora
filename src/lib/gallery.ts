import galleryJson from '@/data/gallery.json'

export type GalleryImage = {
  src: string
  width: number | null
  height: number | null
  blurDataURL: string
}

export const gallery = galleryJson as GalleryImage[]
