'use client'

import { useEffect, useRef } from 'react'
import type { Hospital } from '@/types'

interface HospitalMapProps {
  hospitals: Hospital[]
  selectedId: string | null
  onSelect: (id: string) => void
  radiusKm?: number
  userLat?: number
  userLng?: number
}

export function HospitalMap({
  hospitals,
  selectedId,
  onSelect,
  radiusKm,
  userLat,
  userLng,
}: HospitalMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

      const centerLng = userLng ?? 8.6753
      const centerLat = userLat ?? 9.082

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [centerLng, centerLat],
        zoom: userLat ? 10 : 5.5,
        maxZoom: 16,
      })

      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.on('load', () => {
        // Radius circle
        if (userLat && userLng && radiusKm) {
          const center = [userLng, userLat]
          const radiusInDegrees = radiusKm / 111
          const points = 64
          const coords = []
          for (let i = 0; i < points; i++) {
            const angle = (i / points) * (2 * Math.PI)
            coords.push([
              center[0] + radiusInDegrees * Math.cos(angle),
              center[1] + radiusInDegrees * Math.sin(angle),
            ])
          }
          coords.push(coords[0])

          map.addSource('radius', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: { type: 'Polygon', coordinates: [coords] },
              properties: {},
            },
          })
          map.addLayer({
            id: 'radius-fill',
            type: 'fill',
            source: 'radius',
            paint: { 'fill-color': '#5B50F0', 'fill-opacity': 0.08 },
          })
          map.addLayer({
            id: 'radius-outline',
            type: 'line',
            source: 'radius',
            paint: {
              'line-color': '#5B50F0',
              'line-width': 2,
              'line-opacity': 0.4,
            },
          })
        }

        // Hospital markers
        hospitals.forEach((hospital) => {
          const h = hospital as unknown as { lng: number; lat: number }
          const lng = Number(h.lng)
          const lat = Number(h.lat)

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) return

          const isSelected = selectedId === hospital.id

          // Plain circle — no rotation so hover never causes it to fly
          const el = document.createElement('div')
          el.style.cssText = `
            width: 22px;
            height: 22px;
            border-radius: 50%;
            cursor: pointer;
            background: ${isSelected ? '#4338CA' : '#5B50F0'};
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
          `

          // Popup shown on hover
          const popup = new mapboxgl.Popup({
            offset: 18,
            closeButton: false,
            closeOnClick: false,
            maxWidth: '240px',
          }).setHTML(`
            <div style="font-family: 'DM Sans', sans-serif; padding: 10px 12px; min-width: 180px;">
              <p style="font-weight: 700; font-size: 13px; margin: 0 0 4px; color: #0D1B2A; line-height: 1.3;">
                ${hospital.name}
              </p>
              <p style="font-size: 11px; color: #6B7280; margin: 0 0 6px;">
                📍 ${hospital.city}, ${hospital.state}
              </p>
              ${
                hospital.address
                  ? `<p style="font-size: 11px; color: #6B7280; margin: 0 0 6px;">${hospital.address}</p>`
                  : ''
              }
              <div style="margin-bottom: 6px;">
                <span style="
                  font-size: 10px;
                  font-weight: 600;
                  padding: 2px 8px;
                  border-radius: 20px;
                  background: ${hospital.ownership === 'private' ? '#fef3c7' : '#dcfce7'};
                  color: ${hospital.ownership === 'private' ? '#92400e' : '#166534'};
                  text-transform: capitalize;
                ">${hospital.ownership}</span>
              </div>
              ${
                hospital.specialties?.length
                  ? `<p style="font-size: 11px; color: #5B50F0; margin: 0 0 4px; font-weight: 500;">
                      ${hospital.specialties.slice(0, 2).join(' · ')}
                    </p>`
                  : ''
              }
              ${
                hospital.rating_avg
                  ? `<p style="font-size: 12px; color: #F59E0B; margin: 0 0 4px;">
                      ${'★'.repeat(Math.round(hospital.rating_avg))}${'☆'.repeat(5 - Math.round(hospital.rating_avg))}
                      <span style="font-size: 11px; color: #6B7280;">
                        ${hospital.rating_avg.toFixed(1)} (${hospital.review_count ?? 0})
                      </span>
                    </p>`
                  : ''
              }
              ${
                hospital.phone
                  ? `<p style="font-size: 11px; color: #6B7280; margin: 4px 0 0;">📞 ${hospital.phone}</p>`
                  : ''
              }
            </div>
          `)

          // No .setPopup() — hover controls it manually
          new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map)

          // Hover: scale only, no rotation
          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.3)'
            el.style.background = '#4338CA'
            el.style.boxShadow = '0 4px 16px rgba(91,80,240,0.5)'
            popup.setLngLat([lng, lat]).addTo(map)
          })

          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)'
            el.style.background = isSelected ? '#4338CA' : '#5B50F0'
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
            popup.remove()
          })

          // Click selects hospital in the results list
          el.addEventListener('click', () => {
            onSelect(hospital.id)
          })
        })
      })
    }

    initMap()

    return () => {
      mapRef.current?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Search location on map (e.g. Kano, Abuja)..."
          className="input-base"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const query = (e.target as HTMLInputElement).value
              if (!query || !mapRef.current) return
              fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                  query + ', Nigeria'
                )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`
              )
                .then((r) => r.json())
                .then((data) => {
                  if (data.features?.length > 0) {
                    const [lng, lat] = data.features[0].center
                    mapRef.current!.flyTo({
                      center: [lng, lat],
                      zoom: 10,
                      duration: 1500,
                    })
                  }
                })
            }
          }}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--fg-subtle)' }}>
          Press Enter to search
        </p>
      </div>

      <div
        ref={mapContainer}
        className="rounded-2xl overflow-hidden border"
        style={{ height: 480, borderColor: 'var(--border)' }}
        aria-label="Hospital map"
        role="region"
      />
    </div>
  )
}
