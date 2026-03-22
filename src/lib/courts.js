import rawCourtData from '../data/charlottesvilleCourts.json'

export const CHARLOTTESVILLE_CENTER = {
  lat: 38.0293,
  lng: -78.4767,
}

export const DEFAULT_COURT_IMAGE =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80'

export function buildGoogleMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export function haversineMiles(fromLat, fromLng, toLat, toLng) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180
  const earthRadiusMiles = 3958.8
  const deltaLat = toRadians(toLat - fromLat)
  const deltaLng = toRadians(toLng - fromLng)
  const lat1 = toRadians(fromLat)
  const lat2 = toRadians(toLat)

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const allCourts = rawCourtData.courts.map((court) => ({
  ...court,
  googleMapsUrl: buildGoogleMapsUrl(court.address),
  imageUrl: court.imageUrl ?? DEFAULT_COURT_IMAGE,
}))
