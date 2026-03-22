export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function makeAvatar(username) {
  return username.slice(0, 2).toUpperCase()
}

export function generateToken() {
  return crypto.randomUUID()
}

export function generateId() {
  return crypto.randomUUID()
}

export async function fetchUsers() {
  const res = await fetch('/api/users')
  const data = await res.json()
  return data.users || []
}

export async function saveUsers(users) {
  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users }),
  })
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password) {
  return password.length >= 6
}

const GEO_CACHE_KEY = 'pr_geo_cache'
const GEO_CACHE_TTL_MS = 1000 * 60 * 60 * 6

function readCachedLocation() {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY)
    if (!raw) return null

    const cached = JSON.parse(raw)
    if (!cached?.label || !cached?.timestamp) return null
    if (Date.now() - cached.timestamp > GEO_CACHE_TTL_MS) return null

    return cached
  } catch {
    return null
  }
}

function writeCachedLocation(location) {
  localStorage.setItem(
    GEO_CACHE_KEY,
    JSON.stringify({
      ...location,
      timestamp: Date.now(),
    }),
  )
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 1000 * 60 * 5,
      timeout: 10000,
    })
  })
}

async function reverseGeocode(latitude, longitude) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!res.ok) {
    throw new Error('Unable to look up your current location.')
  }

  const data = await res.json()
  const address = data.address || {}

  return (
    address.city ||
    address.town ||
    address.village ||
    address.county ||
    data.display_name?.split(',')?.[0] ||
    'Unknown'
  )
}

export async function getActiveLocation({ forceRefresh = false } = {}) {
  const cached = !forceRefresh ? readCachedLocation() : null
  if (cached) return cached

  const position = await getCurrentPosition()
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  const label = await reverseGeocode(latitude, longitude)

  const resolved = { label, latitude, longitude }
  writeCachedLocation(resolved)
  return resolved
}
