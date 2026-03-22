import { useEffect, useMemo, useState } from 'react'
import { allCourts, CHARLOTTESVILLE_CENTER, haversineMiles } from '../lib/courts'

export function useCourtData() {
  const [userLocation, setUserLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('loading')

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported')
      return
    }

    const handlePosition = ({ coords }) => {
      setUserLocation({
        lat: coords.latitude,
        lng: coords.longitude,
      })
      setLocationStatus('ready')
    }

    // Get a fast approximate position first so court sorting updates quickly,
    // then let the high-accuracy watch refine it.
    navigator.geolocation.getCurrentPosition(
      handlePosition,
      () => {
        setLocationStatus((currentStatus) => (currentStatus === 'ready' ? currentStatus : 'loading'))
      },
      {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 300000,
      },
    )

    const watchId = navigator.geolocation.watchPosition(
      handlePosition,
      () => {
        setLocationStatus((currentStatus) => (currentStatus === 'ready' ? currentStatus : 'denied'))
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const origin = userLocation ?? CHARLOTTESVILLE_CENTER

  const courts = useMemo(
    () =>
      allCourts
        .map((court) => {
          const coords = court.coords ?? null
          const distanceMiles = coords
            ? haversineMiles(origin.lat, origin.lng, coords.lat, coords.lng)
            : null

          return {
            ...court,
            coords,
            distanceMiles,
            distanceLabel: distanceMiles === null ? '' : `${distanceMiles.toFixed(1)} mi`,
            occupancy:
              court.cost.category === 'free' ? 38 : court.cost.category === 'membership' ? 61 : 74,
          }
        })
        .sort((left, right) => {
          if (left.distanceMiles === null && right.distanceMiles === null) {
            return left.name.localeCompare(right.name)
          }

          if (left.distanceMiles === null) {
            return 1
          }

          if (right.distanceMiles === null) {
            return -1
          }

          return left.distanceMiles - right.distanceMiles
        }),
    [origin.lat, origin.lng],
  )

  return {
    courts,
    userLocation,
    locationStatus,
    isUsingPreciseLocation: Boolean(userLocation),
  }
}
