import axios from 'axios';
import Captain from '@/models/Captain';

// Nominatim API configuration
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'YatraRide/1.0'; // Required by Nominatim

// OpenRouteService configuration
const ORS_BASE_URL = 'https://api.openrouteservice.org/v2';
const ORS_API_KEY = process.env.OPENROUTESERVICE_API_KEY || '';

// Fare calculation constants
const BASE_FARE = Number(process.env.BASE_FARE) || 50;
const PER_KM_RATE = Number(process.env.PER_KM_RATE) || 15;

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

export const getAddressCoordinate = async (address: string) => {
    if (!address) {
        throw new Error('Address is required');
    }

    const url = `${NOMINATIM_BASE_URL}/search`;
    const params = {
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'in'
    };

    try {
        const response = await axios.get(url, {
            params,
            headers: {
                'User-Agent': USER_AGENT
            }
        });

        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            const ltd = parseFloat(location.lat);
            const lng = parseFloat(location.lon);

            if (isNaN(ltd) || isNaN(lng)) {
                throw new Error('Invalid coordinates received from geocoding service');
            }

            return { ltd, lng };
        } else {
            throw new Error('No results found for the given address');
        }
    } catch (error: any) {
        console.error('Nominatim Geocoding Error:', error.message);
        throw error;
    }
};

export const calculateFare = (distanceInMeters: number) => {
    let distanceInKm = distanceInMeters / 1000;
    if (isNaN(distanceInKm)) distanceInKm = 1;

    const distanceFare = distanceInKm * PER_KM_RATE;
    const totalFare = BASE_FARE + distanceFare;

    return {
        fare: Math.round(totalFare),
        distance: parseFloat(distanceInKm.toFixed(2)),
        breakdown: {
            baseFare: BASE_FARE,
            distanceFare: Math.round(distanceFare),
            perKmRate: PER_KM_RATE
        }
    };
};

export const getDistanceTime = async (origin: string, destination: string) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        let originCoords: { ltd: number; lng: number } | undefined;
        let destCoords: { ltd: number; lng: number } | undefined;

        if (origin.includes(',')) {
            const [lat, lng] = origin.split(',').map(s => parseFloat(s.trim()));
            originCoords = { lng, ltd: lat };
        } else {
            originCoords = await getAddressCoordinate(origin);
        }

        if (destination.includes(',')) {
            const [lat, lng] = destination.split(',').map(s => parseFloat(s.trim()));
            destCoords = { lng, ltd: lat };
        } else {
            destCoords = await getAddressCoordinate(destination);
        }

        if (!originCoords || !destCoords || isNaN(originCoords.ltd) || isNaN(destCoords.ltd) || isNaN(originCoords.lng) || isNaN(destCoords.lng)) {
            throw new Error('Could not resolve location coordinates');
        }

        if (ORS_API_KEY) {
            try {
                const url = `${ORS_BASE_URL}/directions/driving-car`;
                const body = {
                    coordinates: [
                        [originCoords.lng, originCoords.ltd],
                        [destCoords.lng, destCoords.ltd]
                    ]
                };

                const response = await axios.post(url, body, {
                    headers: {
                        'Authorization': ORS_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data?.routes?.length > 0) {
                    const route = response.data.routes[0];
                    const distanceInMeters = route.summary.distance || 0;
                    const durationInSeconds = route.summary.duration || 0;

                    return {
                        distance: {
                            text: `${(distanceInMeters / 1000).toFixed(2)} km`,
                            value: distanceInMeters
                        },
                        duration: {
                            text: `${Math.round(durationInSeconds / 60)} mins`,
                            value: durationInSeconds
                        },
                        fare: calculateFare(distanceInMeters),
                        route: route.geometry
                    };
                }
            } catch (orsError: any) {
                console.warn('ORS Error, falling back to Haversine:', orsError.message);
            }
        }

        const distanceInMeters = calculateHaversineDistance(originCoords.ltd, originCoords.lng, destCoords.ltd, destCoords.lng);
        const durationInSeconds = ((distanceInMeters / 1000) / 40 * 3600);

        return {
            distance: {
                text: `${(distanceInMeters / 1000).toFixed(2)} km`,
                value: distanceInMeters
            },
            duration: {
                text: `${Math.round(durationInSeconds / 60)} mins`,
                value: durationInSeconds
            },
            fare: calculateFare(distanceInMeters),
            // Fallback straight line route
            route: {
                type: 'LineString',
                coordinates: [
                    [originCoords.lng, originCoords.ltd],
                    [destCoords.lng, destCoords.ltd]
                ]
            }
        };
    } catch (error: any) {
        console.error('Distance Calculation Error:', error.message);
        return {
            distance: { text: '1.00 km', value: 1000 },
            duration: { text: '5 mins', value: 300 },
            fare: calculateFare(1000)
        };
    }
};

export const getAddressFromCoordinates = async (ltd: number, lng: number) => {
    if (!ltd || !lng) throw new Error('Latitude and Longitude are required');

    const url = `${NOMINATIM_BASE_URL}/reverse`;
    const params = { lat: ltd, lon: lng, format: 'json' };

    try {
        const response = await axios.get(url, {
            params,
            headers: { 'User-Agent': USER_AGENT }
        });

        if (response.data?.address) {
            const addr = response.data.address;
            const parts = [];
            if (addr.road) parts.push(addr.road);
            if (addr.suburb) parts.push(addr.suburb);
            if (addr.neighbourhood) parts.push(addr.neighbourhood);
            if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);

            return { address: parts.length >= 2 ? parts.join(', ') : response.data.display_name };
        }
        throw new Error('No address found');
    } catch (error: any) {
        console.error('Reverse Geocoding Error:', error.message);
        throw error;
    }
};

export const getAutoCompleteSuggestions = async (input: string, ltd: number | null = null, lng: number | null = null) => {
    if (!input) throw new Error('Query is required');

    const url = `${NOMINATIM_BASE_URL}/search`;
    const params: any = { q: input, format: 'json', limit: 8, addressdetails: 1, countrycodes: 'in' };
    if (ltd && lng) {
        const offset = 0.5;
        params.viewbox = `${lng - offset},${ltd + offset},${lng + offset},${ltd - offset}`;
        params.bounded = 0;
    }

    try {
        const response = await axios.get(url, {
            params,
            headers: { 'User-Agent': USER_AGENT }
        });

        return response.data.map((place: any) => {
            const addr = place.address;
            const name = place.display_name.split(',')[0];
            const area = addr.suburb || addr.neighbourhood || addr.city_district || '';
            const city = addr.city || addr.town || addr.village || '';
            let display = name;
            if (area && !name.includes(area)) display += `, ${area}`;
            if (city && !name.includes(city) && !area.includes(city)) display += `, ${city}`;
            return display || place.display_name;
        });
    } catch (error: any) {
        console.error('Autocomplete Error:', error.message);
        throw error;
    }
};

export const getCaptainsInTheRadius = async (ltd: number, lng: number, radius: number) => {
    return await Captain.find({
        location: {
            $near: {
                $geometry: { type: 'Point', coordinates: [lng, ltd] },
                $maxDistance: radius * 1000
            }
        },
        status: 'active'
    });
};
