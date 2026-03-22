import { useEffect, useMemo, useRef, useState } from 'react'
import { Crosshair, MapPin } from 'lucide-react'
import { useCourtData } from '../hooks/useCourtData'
import { CHARLOTTESVILLE_CENTER } from '../lib/courts'

const LEAFLET_CSS_ID = 'leaflet-css-cdn'
const LEAFLET_SCRIPT_ID = 'leaflet-script-cdn'
const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_SCRIPT_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

function loadLeafletAssets() {
  if (!document.getElementById(LEAFLET_CSS_ID)) {
    const link = document.createElement('link')
    link.id = LEAFLET_CSS_ID
    link.rel = 'stylesheet'
    link.href = LEAFLET_CSS_URL
    document.head.appendChild(link)
  }

  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L)
      return
    }

    let script = document.getElementById(LEAFLET_SCRIPT_ID)

    if (!script) {
      script = document.createElement('script')
      script.id = LEAFLET_SCRIPT_ID
      script.src = LEAFLET_SCRIPT_URL
      script.async = true
      script.onload = () => resolve(window.L)
      script.onerror = reject
      document.body.appendChild(script)
      return
    }

    script.addEventListener('load', () => resolve(window.L), { once: true })
    script.addEventListener('error', reject, { once: true })
  })
}

function CourtsMapPage() {
  const { courts, userLocation } = useCourtData()
  const [selectedCourtId, setSelectedCourtId] = useState(null)
  const [mapStatus, setMapStatus] = useState('loading')
  const [flashingCourtId, setFlashingCourtId] = useState(null)
  const mapElementRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersLayerRef = useRef(null)
  const courtItemRefs = useRef({})
  const hasUserPickedCourtRef = useRef(false)
  const hasInitializedViewRef = useRef(false)

  const mappedCourts = useMemo(() => courts.filter((court) => court.coords), [courts])
  const selectedCourt =
    courts.find((court) => court.id === selectedCourtId) ?? mappedCourts[0] ?? courts[0] ?? null

  useEffect(() => {
    if (!selectedCourtId && courts[0]) {
      setSelectedCourtId(courts[0].id)
    }
  }, [courts, selectedCourtId])

  useEffect(() => {
    if (!hasUserPickedCourtRef.current && userLocation && courts[0] && selectedCourtId !== courts[0].id) {
      setSelectedCourtId(courts[0].id)
    }
  }, [courts, selectedCourtId, userLocation])

  useEffect(() => {
    if (!selectedCourtId) {
      return undefined
    }

    setFlashingCourtId(selectedCourtId)
    const timeoutId = window.setTimeout(() => {
      setFlashingCourtId((currentValue) => (currentValue === selectedCourtId ? null : currentValue))
    }, 1400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [selectedCourtId])

  useEffect(() => {
    let cancelled = false

    async function initializeMap() {
      if (!mapElementRef.current) {
        return
      }

      try {
        const L = await loadLeafletAssets()
        if (cancelled || !mapElementRef.current) {
          return
        }

        if (!mapInstanceRef.current) {
          const map = L.map(mapElementRef.current, {
            zoomControl: false,
          }).setView([CHARLOTTESVILLE_CENTER.lat, CHARLOTTESVILLE_CENTER.lng], 12)

          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          }).addTo(map)

          L.control.zoom({ position: 'bottomright' }).addTo(map)

          markersLayerRef.current = L.layerGroup().addTo(map)
          mapInstanceRef.current = map
        }

        setMapStatus('ready')
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setMapStatus('error')
        }
      }
    }

    initializeMap()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!window.L || !mapInstanceRef.current || !markersLayerRef.current) {
      return
    }

    const L = window.L
    const layer = markersLayerRef.current
    layer.clearLayers()

    const bounds = []

    mappedCourts.forEach((court) => {
      const isSelected = selectedCourt?.id === court.id
      const marker = L.circleMarker([court.coords.lat, court.coords.lng], {
        radius: isSelected ? 11 : 8,
        color: isSelected ? '#7f1d1d' : '#991b1b',
        weight: isSelected ? 5 : 3,
        fillColor: isSelected ? '#ef4444' : '#dc2626',
        fillOpacity: isSelected ? 1 : 0.9,
      })
      marker.on('click', () => {
        hasUserPickedCourtRef.current = true
        setSelectedCourtId(court.id)
      })
      marker.bindTooltip(court.name, { direction: 'top', offset: [0, -12] })
      marker.addTo(layer)
      bounds.push([court.coords.lat, court.coords.lng])
    })

    if (userLocation) {
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#1a73e8',
        fillOpacity: 1,
      })
      userMarker.bindTooltip('Your location', { direction: 'top' })
      userMarker.addTo(layer)
      bounds.push([userLocation.lat, userLocation.lng])
    }

    if (selectedCourt?.coords) {
      if (!hasInitializedViewRef.current) {
        mapInstanceRef.current.setView([selectedCourt.coords.lat, selectedCourt.coords.lng], 13, {
          animate: false,
        })
        hasInitializedViewRef.current = true
      } else {
        mapInstanceRef.current.panTo([selectedCourt.coords.lat, selectedCourt.coords.lng], {
          animate: true,
          duration: 0.4,
        })
      }
    } else if (!hasInitializedViewRef.current && bounds.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [32, 32] })
      hasInitializedViewRef.current = true
    }
  }, [mapStatus, mappedCourts, selectedCourt, userLocation])

  useEffect(() => {
    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
      markersLayerRef.current = null
      hasInitializedViewRef.current = false
    }
  }, [])

  const handleRecenter = () => {
    if (!mapInstanceRef.current) {
      return
    }

    const target = userLocation ?? CHARLOTTESVILLE_CENTER
    mapInstanceRef.current.setView([target.lat, target.lng], userLocation ? 13 : 12, {
      animate: true,
    })
  }

  return (
    <div className="grid gap-[18px] px-5 py-5 sm:px-7 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--card)]">
        <div className="border-b border-[var(--border-sub)] px-5 py-4">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Court Map
            </div>
            <div className="mt-1 text-[13px] text-[var(--muted)]">Click a map point to sync and highlight the court list.</div>
          </div>
        </div>

        <div className="relative">
          <div
            ref={mapElementRef}
            className="h-[calc(100vh-210px)] min-h-[460px] w-full bg-[var(--card2)]"
          />
          <button
            type="button"
            onClick={handleRecenter}
            aria-label="Recenter map"
            className="absolute bottom-28 right-[10px] z-[500] inline-flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border-2 border-black bg-white text-black shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
          >
            <Crosshair className="h-4 w-4 text-black stroke-black" strokeWidth={2.4} />
          </button>
        </div>

        {mapStatus === 'error' ? (
          <div className="border-t border-[var(--border-sub)] px-5 py-4 text-[13px] text-[var(--muted)]">
            Leaflet failed to load in the browser. The court detail panel still works, but the map could not render.
          </div>
        ) : null}
      </section>

      <aside className="flex flex-col gap-[18px]">
        {selectedCourt ? (
          <article className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--card)]">
            <img
              src={selectedCourt.imageUrl}
              alt={selectedCourt.name}
              className="h-[200px] w-full object-cover"
            />
            <div className="space-y-4 px-5 py-4">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  Selected Court
                </div>
                <h2 className="mt-2 text-[20px] font-semibold text-[var(--text)]">{selectedCourt.name}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCourt.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-[rgba(200,241,53,0.08)] px-2 py-[5px] text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]"
                    >
                      {category.replaceAll('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-[13px] text-[var(--muted)]">
                <div>{selectedCourt.courtCount} courts</div>
                <div>{selectedCourt.netType === 'permanent' ? 'Permanent nets' : 'Portable nets'}</div>
                <div>{selectedCourt.cost.label}</div>
                <div>{selectedCourt.distanceLabel}</div>
              </div>

              <a
                href={selectedCourt.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-2 text-[13px] text-[var(--text)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                <MapPin className="mt-[2px] h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={1.8} />
                <span>
                  {selectedCourt.address}
                  <span className="ml-2 text-[11px] uppercase tracking-[0.08em] text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]">
                    Open in Google Maps
                  </span>
                </span>
              </a>

            </div>
          </article>
        ) : null}

        <section className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-5 py-4">
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            All Courts
          </div>
          <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {courts.map((court) => (
              <button
                key={court.id}
                ref={(node) => {
                  if (node) {
                    courtItemRefs.current[court.id] = node
                  }
                }}
                type="button"
                onClick={() => {
                  hasUserPickedCourtRef.current = true
                  setSelectedCourtId(court.id)
                }}
                className={[
                  'w-full rounded-[10px] border px-3 py-3 text-left transition-colors',
                  selectedCourt?.id === court.id
                    ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]'
                    : 'border-[var(--border)] bg-[var(--card2)]',
                  flashingCourtId === court.id ? 'court-list-flash' : '',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-medium text-[var(--text)]">{court.name}</div>
                    <div className="mt-1 text-[11px] text-[var(--muted)]">
                      {[court.distanceLabel, court.address].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="shrink-0 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
                    {court.cost.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}

export default CourtsMapPage
