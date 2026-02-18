'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const MapRecenter = dynamic(() => import('./MapRecenter'), { ssr: false });
const MapRouteFocus = dynamic(() => import('./MapRouteFocus'), { ssr: false });

interface LiveTrackingProps {
    pickupLocation: [number, number] | null;
    dropLocation: [number, number] | null;
    route: any;
    captains?: any[];
}

const LiveTracking = ({ pickupLocation, dropLocation, route, captains = [] }: LiveTrackingProps) => {
    const [L, setL] = useState<any>(null);
    const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([22.7196, 75.8577]); // Indore coordinates as default
    const [isMounted, setIsMounted] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        setIsMounted(true);
        import('leaflet').then((leaflet) => {
            const LInstance = leaflet.default;
            setL(LInstance);

            // Fix Leaflet default icon paths in Next.js
            delete (LInstance.Icon.Default.prototype as any)._getIconUrl;
            LInstance.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        });

        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location: [number, number] = [latitude, longitude];
                    setUserLocation(location);
                    setCurrentPosition(location);
                    setMapCenter(location);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Fallback to Indore if geolocation fails
                    setMapCenter([22.7196, 75.8577]);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, []);

    useEffect(() => {
        if (pickupLocation) {
            setCurrentPosition(pickupLocation);
            setMapCenter(pickupLocation);
        }
    }, [pickupLocation]);

    // Debug log to see captains in console
    useEffect(() => {
        if (captains.length > 0) {
            console.log('Rendering captains:', captains.length);
        }
    }, [captains]);

    if (!isMounted || !L) {
        return (
            <div className="h-full w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-bold">Loading Map...</p>
                </div>
            </div>
        );
    }

    const pickupIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const dropIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const userIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const getCaptainDivIcon = (vehicleType: string) => {
        let emoji = '🏍️';
        let colorClass = 'bg-indigo-500';
        if (vehicleType === 'car') { emoji = '🚗'; colorClass = 'bg-emerald-500'; }
        if (vehicleType === 'auto') { emoji = '🛺'; colorClass = 'bg-amber-500'; }

        return new L.DivIcon({
            html: `<div class="relative flex items-center justify-center">
                <div class="absolute w-10 h-10 ${colorClass} rounded-full animate-ping opacity-20"></div>
                <div class="w-8 h-8 bg-slate-900 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-sm z-10">
                    ${emoji}
                </div>
            </div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    };

    const displayPosition = currentPosition || userLocation || mapCenter;


    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapContainer
                center={mapCenter}
                zoom={15}
                className="h-full w-full"
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapRecenter center={mapCenter} />

                {displayPosition && <Marker position={displayPosition} icon={userIcon} />}

                {/* Nearby Captains */}
                {captains.map((captain: any) => (
                    <Marker
                        key={captain._id}
                        position={[captain.location.coordinates[1], captain.location.coordinates[0]]}
                        icon={getCaptainDivIcon(captain.vehicle.vehicleType)}
                    >
                        <Popup>
                            <div className="p-2 min-w-[120px]">
                                <h4 className="font-black text-slate-900 leading-tight mb-1">{captain.fullname.firstname}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-500 uppercase tracking-widest">{captain.vehicle.vehicleType}</span>
                                    <span className="text-[10px] font-bold text-indigo-600">{captain.vehicle.plate}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {pickupLocation && <Marker position={pickupLocation} icon={pickupIcon} />}
                {dropLocation && <Marker position={dropLocation} icon={dropIcon} />}

                {route && route.length > 0 && (
                    <>
                        <MapRouteFocus route={route} />
                        {/* Shadow/Glow effect for the line */}
                        <Polyline positions={route} color="#4f46e5" weight={10} opacity={0.15} />
                        {/* Main direction line */}
                        <Polyline
                            positions={route}
                            color="#4f46e5"
                            weight={5}
                            opacity={1}
                        />
                    </>
                )}
            </MapContainer>

            {/* Current Location Button */}
            <button
                onClick={() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords;
                                const location: [number, number] = [latitude, longitude];
                                setMapCenter(location);
                                setCurrentPosition(location);
                            },
                            undefined,
                            { enableHighAccuracy: true }
                        );
                    }
                }}
                className="absolute bottom-24 right-4 z-[1000] bg-slate-900 text-white p-3 rounded-full shadow-2xl shadow-black/40 border border-indigo-500/20 hover:bg-indigo-600 transition-all"
                title="Center on my location"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
    );
};

export default LiveTracking;
