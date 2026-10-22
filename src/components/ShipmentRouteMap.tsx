import { useEffect, useMemo, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { MapPin } from 'lucide-react';

export interface RouteCheckpoint {
  id: string;
  status: string;
  location: string;
  description: string;
  event_time: string;
  latitude: number | null;
  longitude: number | null;
}

interface ShipmentRouteMapProps {
  events: RouteCheckpoint[];
}

const formatStatus = (status: string) =>
  status.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export default function ShipmentRouteMap({ events }: ShipmentRouteMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);

  const points = useMemo(
    () => events
      .filter((event) =>
        typeof event.latitude === 'number' &&
        Number.isFinite(event.latitude) &&
        event.latitude >= -90 &&
        event.latitude <= 90 &&
        typeof event.longitude === 'number' &&
        Number.isFinite(event.longitude) &&
        event.longitude >= -180 &&
        event.longitude <= 180
      )
      .sort((a, b) => new Date(a.event_time).getTime() - new Date(b.event_time).getTime()),
    [events],
  );

  useEffect(() => {
    let cancelled = false;
    let resizeTimer = 0;
    const activeMapElement = mapElement.current;
    if (!activeMapElement || points.length === 0) return;

    void import('leaflet').then((L) => {
      if (cancelled) return;

      const routeMap = L.map(activeMapElement, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([points[0].latitude!, points[0].longitude!], 6);
      map.current = routeMap;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(routeMap);

      const markers = L.layerGroup().addTo(routeMap);
      const latLngs = points.map((point) => L.latLng(point.latitude!, point.longitude!));
      if (latLngs.length > 1) {
        L.polyline(latLngs, {
          color: '#0f766e',
          weight: 4,
          opacity: 0.85,
          dashArray: '8 8',
        }).addTo(markers);
      }

      points.forEach((point, index) => {
        const marker = L.circleMarker([point.latitude!, point.longitude!], {
          radius: index === points.length - 1 ? 9 : 7,
          color: '#ffffff',
          weight: 3,
          fillColor: index === points.length - 1 ? '#f97316' : '#0f766e',
          fillOpacity: 1,
        });

        const popup = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = formatStatus(point.status);
        const location = document.createElement('p');
        location.textContent = point.location;
        const description = document.createElement('p');
        description.textContent = point.description;
        const timestamp = document.createElement('small');
        timestamp.textContent = new Date(point.event_time).toLocaleString();
        popup.append(title, location, description, timestamp);
        marker.bindPopup(popup).addTo(markers);
      });

      if (latLngs.length === 1) {
        routeMap.setView(latLngs[0], 11);
      } else {
        routeMap.fitBounds(L.latLngBounds(latLngs), { padding: [32, 32], maxZoom: 12 });
      }
      resizeTimer = window.setTimeout(() => routeMap.invalidateSize(), 0);
    }).catch((error: unknown) => {
      console.error('Failed to load the shipment route map', error);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      map.current?.remove();
      map.current = null;
    };
  }, [points]);

  return (
    <section className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-lg shadow-teal-900/5">
      <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
        <span className="rounded-xl bg-teal-50 p-3 text-teal-700">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-bold text-slate-900">Shipment route</h2>
          <p className="mt-1 text-sm text-slate-600">
            {points.length
              ? `${points.length} location checkpoint${points.length === 1 ? '' : 's'} recorded`
              : 'Map positions appear when the courier records a checkpoint with GPS coordinates.'}
          </p>
        </div>
      </div>
      {points.length > 0 ? (
        <div
          ref={mapElement}
          className="h-72 w-full bg-slate-100 sm:h-96"
          aria-label="Map showing recorded shipment route checkpoints"
        />
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 px-6 text-center">
          <MapPin className="mb-3 h-9 w-9 text-teal-700" aria-hidden="true" />
          <p className="font-semibold text-slate-800">Waiting for the first GPS checkpoint</p>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Location names alone can’t pinpoint a reliable route. The map will update automatically as
            coordinatized checkpoints are recorded.
          </p>
        </div>
      )}
      <p className="px-4 py-2 text-xs text-slate-500">
        Map data &copy; OpenStreetMap contributors. Route line connects recorded checkpoints only; it is
        not turn-by-turn navigation or continuous GPS tracking.
      </p>
    </section>
  );
}
