'use client';

import React, { useState } from 'react';
import axios from 'axios';

const RideRequest = () => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [rideType, setRideType] = useState<'private' | 'shared'>('private');
    const [seats, setSeats] = useState(1);
    const [status, setStatus] = useState<string>('idle');
    const [rideData, setRideData] = useState<any>(null);

    const handleRequest = async () => {
        try {
            setStatus('requesting');
            // Mock coordinates for demo (In real app, get from map or geocoding)
            const pickupLocation = { lat: 19.0760, lng: 72.8777 };
            const destinationLocation = { lat: 19.2183, lng: 72.9781 };

            const response = await axios.post('/api/ride/request', {
                pickup,
                destination,
                pickupLocation,
                destinationLocation,
                rideType,
                vehicleType: 'car',
                seatsRequired: seats
            });

            setRideData(response.data);
            setStatus(response.data.status);

            if (response.data.status === 'searching') {
                // Start polling or wait for socket event
                pollStatus(response.data.ride._id);
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const pollStatus = async (rideId: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.post('/api/ride/match', { rideId });
                if (response.data.match) {
                    setStatus('matched');
                    setRideData(response.data);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error(error);
                clearInterval(interval);
            }
        }, 5000);
    };

    return (
        <div className="p-6 bg-slate-900 text-white rounded-xl shadow-2xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Book Your Yatra
            </h2>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Pickup Location"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Destination"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />

                <div className="flex space-x-4">
                    <button
                        onClick={() => setRideType('private')}
                        className={`flex-1 p-3 rounded-lg transition ${rideType === 'private' ? 'bg-indigo-600' : 'bg-slate-800'}`}
                    >
                        Private
                    </button>
                    <button
                        onClick={() => setRideType('shared')}
                        className={`flex-1 p-3 rounded-lg transition ${rideType === 'shared' ? 'bg-indigo-600' : 'bg-slate-800'}`}
                    >
                        Shared
                    </button>
                </div>

                {rideType === 'shared' && (
                    <div className="flex items-center space-x-4">
                        <span>Seats Needed:</span>
                        <select
                            value={seats}
                            onChange={(e) => setSeats(Number(e.target.value))}
                            className="bg-slate-800 p-2 rounded border border-slate-700"
                        >
                            <option value={1}>1 Seat</option>
                            <option value={2}>2 Seats</option>
                        </select>
                    </div>
                )}

                <button
                    onClick={handleRequest}
                    disabled={status === 'requesting'}
                    className="w-full p-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-lg font-bold shadow-lg transition transform hover:scale-105"
                >
                    {status === 'requesting' ? 'Finding Ride...' : 'Book Now'}
                </button>

                {status === 'matched' && (
                    <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg animate-pulse">
                        <p className="text-green-400 font-bold text-center">✓ Match Found! Your co-passenger is joining.</p>
                    </div>
                )}

                {status === 'searching' && (
                    <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                            <span className="text-blue-300">Looking for matches...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RideRequest;
