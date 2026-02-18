'use client';
import React from 'react';
import axios from 'axios';
import { MapPin, Navigation, History, Star, Home, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationSearchPanelProps {
    suggestions: string[];
    setVehiclePanel: (val: boolean) => void;
    setPanelOpen: (val: boolean) => void;
    setPickup: (val: string) => void;
    setDestination: (val: string) => void;
    activeField: 'pickup' | 'destination' | null;
    setPickupLocation: (val: [number, number]) => void;
    setDestinationLocation: (val: [number, number]) => void;
    handleGetCurrentLocation: () => void;
    setPickupSuggestions: (val: any) => void;
    setDestinationSuggestions: (val: any) => void;
}

const LocationSearchPanel = ({
    suggestions,
    setPickup,
    setDestination,
    activeField,
    setPickupLocation,
    setDestinationLocation,
    handleGetCurrentLocation,
    setPanelOpen,
    setPickupSuggestions,
    setDestinationSuggestions
}: LocationSearchPanelProps) => {

    const handleSuggestionClick = async (suggestion: string) => {
        setPanelOpen(false); // Close suggestions panel immediately
        if (activeField === 'pickup') {
            setPickup(suggestion);
            setPickupSuggestions([]); // Clear suggestions list
            try {
                const response = await axios.get(`/api/maps/get-coordinates`, {
                    params: { address: suggestion },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setPickupLocation([response.data.ltd, response.data.lng]);
            } catch (error) {
                console.error('Error fetching pickup coordinates:', error);
            }
        } else if (activeField === 'destination') {
            setDestination(suggestion);
            setDestinationSuggestions([]); // Clear suggestions list
            try {
                const response = await axios.get(`/api/maps/get-coordinates`, {
                    params: { address: suggestion },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDestinationLocation([response.data.ltd, response.data.lng]);
            } catch (error) {
                console.error('Error fetching destination coordinates:', error);
            }
        }
    };

    return (
        <div className="py-2 space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
            {suggestions.length > 0 ? (
                <div className="space-y-1">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2">Search Results</h5>
                    {suggestions.map((elem, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={idx}
                            onClick={() => handleSuggestionClick(elem)}
                            className='flex gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-all items-center justify-start rounded-[1.5rem] group border border-transparent hover:border-slate-100/80 active:scale-[0.98]'
                        >
                            <div className='bg-slate-100 h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm'>
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className='font-bold text-sm text-slate-700 truncate group-hover:text-slate-900'>{elem}</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 opacity-60">Verified Address</p>
                            </div>
                            <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
                                <ArrowRight className='w-4 h-4 text-indigo-600' />
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Saved Locations Mockup */}
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2">Frequent Places</h5>
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            {[
                                { icon: Home, label: 'Home', sub: 'Sector 62, Noida' },
                                { icon: Briefcase, label: 'Office', sub: 'Cyber City, GGN' },
                            ].map((place, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group active:scale-95">
                                    <place.icon className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                                    <h6 className="text-sm font-black text-slate-800">{place.label}</h6>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">{place.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 mx-2"></div>

                    <div className="space-y-4 px-1">
                        <div
                            onClick={() => {
                                handleGetCurrentLocation();
                                setPanelOpen(false);
                            }}
                            className="flex items-center gap-4 p-4 rounded-3xl bg-indigo-50/50 border border-indigo-100 text-indigo-700 cursor-pointer hover:bg-indigo-100 transition-all group active:scale-[0.98]"
                        >
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100">
                                <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                            </div>
                            <div>
                                <span className="text-sm font-black block">Current Location</span>
                                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-none">GPS Integrated</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationSearchPanel;
