import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox'
import { siteConfig } from '@/lib/config'

function formatWeddingDate(date: Date, timeZone: string) {
  const formattedDate = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone }).toLowerCase()
  const formattedDayNum = date.toLocaleDateString('en-GB', { day: 'numeric', timeZone })
  const formattedDay = date.toLocaleDateString('en-GB', { weekday: 'long', timeZone }).toLowerCase()
  const hour = Number(date.toLocaleTimeString('en-GB', { hour: 'numeric', hour12: false, timeZone }))
  const formattedTime = `${hour % 12 || 12} o'clock`

  return { formattedDate, formattedDayNum, formattedDay, formattedTime }
}

export default function MapTab() {
  const mapRef = useRef<MapRef>(null)
  const [zoomed, setZoomed] = useState(false)
  const { formattedDate, formattedDayNum, formattedDay, formattedTime } = formatWeddingDate(
    siteConfig.weddingDate,
    siteConfig.timeZone,
  )

  const handleZoom = () => {
    const target = zoomed ? siteConfig.countryCoords : siteConfig.mapCoords

    mapRef.current?.flyTo({
      center: [target.longitude, target.latitude],
      zoom: zoomed ? 3.5 : 9,
      duration: 1000,
    })
    setZoomed(!zoomed)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col max-w-[700px] w-[85vw] min-w-[296px] min-h-[25em] bg-base-200 text-accent rounded-2xl"
    >
      {siteConfig.mapboxToken ? (
        <Map
          ref={mapRef}
          reuseMaps
          mapboxAccessToken={siteConfig.mapboxToken}
          initialViewState={{
            latitude: siteConfig.countryCoords.latitude,
            longitude: siteConfig.countryCoords.longitude,
            zoom: 3.5,
          }}
          style={{
            display: 'flex',
            flex: 1,
            alignContent: 'right',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
          }}
          mapStyle={siteConfig.mapStyle}
          dragRotate={false}
          touchPitch={false}
        >
          <Marker
            color="#31553d"
            latitude={siteConfig.markerCoords.latitude}
            longitude={siteConfig.markerCoords.longitude}
            anchor="bottom"
          ></Marker>
          <label className="btn btn-circle absolute top-0 right-0 m-2 btn-neutral swap swap-rotate">
            <input type="checkbox" aria-label="Toggle map zoom" checked={zoomed} onChange={handleZoom} />
            <svg className="swap-off fill-current w-5" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40">
              <path d="M147.333-100 100-147.333l139.334-139.334H120v-66.666h233.333V-120h-66.666v-119.334L147.333-100Zm665.334 0L673.333-239.334V-120h-66.666v-233.333H840v66.666H720.666L860-147.333 812.667-100ZM120-606.667v-66.666h119.334L100-812.667 147.333-860l139.334 139.334V-840h66.666v233.333H120Zm486.667 0V-840h66.666v119.334l140.001-140.001 47.333 47.333-140.001 140.001H840v66.666H606.667Z" />
            </svg>
            <svg className="swap-on fill-current w-5" xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40">
              <path d="M120-120v-233.333h66.666v119.334L326.667-374 374-326.667 233.999-186.666h119.334V-120H120Zm486.667 0v-66.666h119.334L586.667-326 634-373.333l139.334 139.334v-119.334H840V-120H606.667ZM326-586.667 186.666-726.001v119.334H120V-840h233.333v66.666H233.999L373.333-634 326-586.667Zm308 0L586.667-634l139.334-139.334H606.667V-840H840v233.333h-66.666v-119.334L634-586.667Z" />
            </svg>
          </label>
        </Map>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-t-2xl bg-base-300 px-8 text-center">
          Add a Mapbox token to show the venue map.
        </div>
      )}
      <div>
        <h2 className="mx-5 pt-5 justify-center font-medium text-xl text-center tracking-wide">
          {siteConfig.venue.toLowerCase()}
          <span className="hidden sm:inline"> • </span>
          <br className="sm:hidden"></br>
          {siteConfig.location.toLowerCase()}
        </h2>
        <p className="mx-5 mb-5 justify-center font-medium text-xl text-center tracking-wide">
          {formattedDayNum}
          <sup>Þ </sup>
          {formattedDate}
          <span className="hidden sm:inline"> • </span>
          <br className="sm:hidden" />
          {formattedDay + ' ' + formattedTime}
        </p>
      </div>
    </motion.div>
  )
}
