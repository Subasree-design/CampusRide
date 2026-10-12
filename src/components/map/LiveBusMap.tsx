import React, { useEffect, useRef, useState } from 'react';
import { Bus, Route, Stop } from '../../types';
import {
  Navigation,
  Crosshair,
  RotateCw,
  Compass,
  MapPin,
  Layers,
  Info,
} from 'lucide-react';
import L from 'leaflet';

interface LiveBusMapProps {
  bus: Bus;
  route?: Route;
  studentPickupStop?: Stop;
  heightClass?: string;
  onRefresh?: () => void;
}

export const LiveBusMap: React.FC<LiveBusMapProps> = ({
  bus,
  route,
  studentPickupStop,
  heightClass = 'h-[380px] sm:h-[480px]',
  onRefresh,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [followBus, setFollowBus] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const initialLat = bus.currentLocation.latitude;
      const initialLng = bus.currentLocation.longitude;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    } catch (err) {
      console.warn('Leaflet map initialization failed, falling back to vector map', err);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Route Polyline & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !route) return;

    // Draw route path polyline
    if (route.pathCoordinates && route.pathCoordinates.length > 0) {
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
      }
      routeLineRef.current = L.polyline(route.pathCoordinates, {
        color: '#4f46e5',
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round',
        dashArray: undefined,
      }).addTo(map);
    }

    // Add Stop Markers
    route.stops.forEach((stop, index) => {
      const isPickup = studentPickupStop?.stopId === stop.stopId;
      const isCollege = index === route.stops.length - 1;

      const markerHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 ${
            isPickup
              ? 'bg-amber-500 text-slate-950 border-white ring-2 ring-amber-400 animate-pulse'
              : isCollege
              ? 'bg-emerald-600 text-white border-white ring-2 ring-emerald-400'
              : 'bg-indigo-600 text-white border-white'
          }">
            ${isPickup ? '📍' : isCollege ? '🏛️' : index + 1}
          </div>
          <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap shadow-sm pointer-events-none">
            ${stop.name.split(' ')[0]}
          </div>
        </div>
      `;

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
        .addTo(map)
        .bindPopup(
          `<div class="p-1 text-slate-900 font-sans">
            <div class="font-bold text-xs">${stop.name}</div>
            <div class="text-[11px] text-slate-500">Scheduled: ${stop.scheduledTime}</div>
            <div class="text-[11px] text-slate-500">Status: <span class="capitalize font-semibold text-indigo-600">${stop.status}</span></div>
            ${isPickup ? '<div class="text-[10px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded mt-1">⭐️ Your Designated Pickup Stop</div>' : ''}
          </div>`
        );
    });
  }, [route, studentPickupStop]);

  // Update Bus Marker Position Smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const lat = bus.currentLocation.latitude;
    const lng = bus.currentLocation.longitude;

    const busIconHtml = `
      <div class="relative flex items-center justify-center">
        <!-- Radar Pulse -->
        <div class="absolute w-12 h-12 rounded-full bg-amber-400/40 animate-ping"></div>
        <div class="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xl border-2 border-white ring-2 ring-amber-600">
          🚌
        </div>
        <div class="absolute -top-6 bg-slate-950 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-amber-500/50 whitespace-nowrap">
          ${bus.busNumber} • ${bus.currentSpeed} km/h
        </div>
      </div>
    `;

    const busIcon = L.divIcon({
      className: 'custom-bus-marker',
      html: busIconHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    if (busMarkerRef.current) {
      busMarkerRef.current.setLatLng([lat, lng]);
      busMarkerRef.current.setIcon(busIcon);
    } else {
      busMarkerRef.current = L.marker([lat, lng], { icon: busIcon }).addTo(map);
    }

    if (followBus) {
      map.panTo([lat, lng], { animate: true, duration: 1 });
    }
  }, [bus.currentLocation, bus.currentSpeed, bus.busNumber, followBus]);

  const handleRecenterBus = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [bus.currentLocation.latitude, bus.currentLocation.longitude],
        15,
        { animate: true }
      );
      setFollowBus(true);
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current && route && route.pathCoordinates.length > 0) {
      const bounds = L.latLngBounds(route.pathCoordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
      setFollowBus(false);
    }
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100`}>
      {/* Fallback Vector Map if Leaflet encounters WebGL/Network block */}
      {mapError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 to-indigo-50">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 shadow-inner">
            <Compass className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">Interactive Route Visualizer</h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
            Simulated GPS navigation active for {bus.busNumber}. Current location: {bus.currentLocation.address}
          </p>
          <div className="w-full max-w-md bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Speed:</span>
              <span className="font-bold text-slate-800">{bus.currentSpeed} km/h</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Heading:</span>
              <span className="font-bold text-slate-800">{bus.currentLocation.heading}°</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Distance to Next Stop:</span>
              <span className="font-bold text-slate-800">{bus.distanceToNextStopMeters} m</span>
            </div>
          </div>
        </div>
      ) : (
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      )}

      {/* Map Control Overlay Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={handleRecenterBus}
          title="Recenter on Bus"
          className="p-2.5 rounded-xl bg-white/95 text-slate-800 hover:text-indigo-600 shadow-md border border-slate-200 hover:bg-white transition-all flex items-center justify-center"
        >
          <Crosshair className="w-4 h-4 text-amber-500" />
        </button>

        <button
          onClick={handleFitRoute}
          title="View Full Route"
          className="p-2.5 rounded-xl bg-white/95 text-slate-800 hover:text-indigo-600 shadow-md border border-slate-200 hover:bg-white transition-all flex items-center justify-center"
        >
          <Layers className="w-4 h-4 text-indigo-600" />
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Location"
            className="p-2.5 rounded-xl bg-white/95 text-slate-800 hover:text-indigo-600 shadow-md border border-slate-200 hover:bg-white transition-all flex items-center justify-center"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Status Ribbon at Bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
              🚌
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {bus.busNumber} • {bus.currentLocation.address}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Speed: <strong className="text-slate-800">{bus.currentSpeed} km/h</strong></span>
                <span>•</span>
                <span>ETA: <strong className="text-indigo-600">{bus.currentETA}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setFollowBus(!followBus)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 border transition-colors ${
              followBus
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            {followBus ? 'Tracking On' : 'Free Pan'}
          </button>
        </div>
      </div>
    </div>
  );
};
