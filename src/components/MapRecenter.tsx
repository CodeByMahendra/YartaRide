'use client';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapRecenter = ({ center, zoom }: { center: [number, number], zoom?: number }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom());
        }
    }, [center, zoom, map]);
    return null;
}

export default MapRecenter;
