'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });

interface LiveTrackingProps {
    pickupLocation: [number, number] | null;
    dropLocation: [number, number] | null;
    route: any;
}

const LiveTracking = ({ pickupLocation, dropLocation, route }: LiveTrackingProps) => {
    const [L, setL] = useState<any>(null);
    const [currentPosition, setCurrentPosition] = useState<[number, number]>(pickupLocation || [20.5937, 78.9629]);
    const [mapCenter, setMapCenter] = useState<[number, number]>(pickupLocation || [20.5937, 78.9629]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
        });
    }, []);

    useEffect(() => {
        if (pickupLocation) {
            setCurrentPosition(pickupLocation);
            setMapCenter(pickupLocation);
        }
    }, [pickupLocation]);

    if (!isMounted || !L) return <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>;

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

    const driverIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapContainer
                center={mapCenter}
                zoom={15}
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={currentPosition} icon={driverIcon} />
                {pickupLocation && <Marker position={pickupLocation} icon={pickupIcon} />}
                {dropLocation && <Marker position={dropLocation} icon={dropIcon} />}
                {route && route.length > 0 && <Polyline positions={route} color="#2563eb" weight={4} opacity={0.7} />}
            </MapContainer>
        </div>
    );
};

export default LiveTracking;
