'use client';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import LocationSearchPanel from '@/components/LocationSearchPanel';
import VehiclePanel from '@/components/VehiclePanel';
import ConfirmRide from '@/components/ConfirmRide';
import LookingForDriver from '@/components/LookingForDriver';
import WaitingForDriver from '@/components/WaitingForDriver';
import { SocketDataContext } from '@/context/SocketContext';
import { UserDataContext } from '@/context/UserDataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LiveTracking from '@/components/LiveTracking';
import { User, LogOut, Navigation, Search, Menu, X, ChevronDown, Bell, Shield, Settings, Wallet, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

const Home = () => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
    const vehiclePanelRef = useRef(null);
    const confirmRidePanelRef = useRef(null);
    const vehicleFoundRef = useRef(null);
    const waitingForDriverRef = useRef(null);
    const panelRef = useRef(null);

    const [vehiclePanel, setVehiclePanel] = useState(false);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false);
    const [vehicleFound, setVehicleFound] = useState(false);
    const [waitingForDriver, setWaitingForDriver] = useState(false);

    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeField, setActiveField] = useState<'pickup' | 'destination' | null>(null);

    const [fare, setFare] = useState<any>({});
    const [vehicleType, setVehicleType] = useState<string | null>(null);
    const [ride, setRide] = useState<any>(null);
    const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<[number, number] | null>(null);
    const [route, setRoute] = useState<any[]>([]);

    const router = useRouter();
    const { socket } = useContext(SocketDataContext);
    const { user } = useContext(UserDataContext);
    const { showToast } = useToast();

    // Initial Setup & Geolocation
    useEffect(() => {
        if (socket && user?._id) {
            socket.emit("join", { userType: "user", userId: user._id });
        }

        if (navigator.geolocation && !pickup) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setPickupLocation([latitude, longitude]);
                try {
                    const response = await axios.get(`/api/maps/get-address-from-coordinates`, {
                        params: { ltd: latitude, lng: longitude },
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (response.data?.address) setPickup(response.data.address);
                } catch (error) {
                    console.error('Error reverse geocoding:', error);
                }
            }, undefined, { enableHighAccuracy: true });
        }
    }, [user, socket]);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;
        socket.on('ride-confirmed', (ride: any) => {
            showToast(`Captain ${ride.captain.fullname.firstname} is on the way!`, 'push', 'RIDE CONFIRMED');
            setVehicleFound(false);
            setWaitingForDriver(true);
            setRide(ride);
        });
        socket.on('ride-started', (ride: any) => {
            showToast('Fasten your seatbelt, the journey has started.', 'success', 'RIDE STARTED');
            setWaitingForDriver(false);
            router.push(`/riding?rideId=${ride._id}`);
        });
        return () => {
            socket.off('ride-confirmed');
            socket.off('ride-started');
        };
    }, [socket]);

    // GSAP Panel Control
    useGSAP(() => {
        if (panelOpen) {
            gsap.to(panelRef.current, { height: 'auto', opacity: 1, duration: 0.6, ease: 'expo.out' });
        } else {
            gsap.to(panelRef.current, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' });
        }
    }, [panelOpen]);

    useGSAP(() => {
        gsap.to(vehiclePanelRef.current, { transform: vehiclePanel ? 'translateY(0)' : 'translateY(110%)', duration: 0.7, ease: 'expo.out' });
    }, [vehiclePanel]);

    useGSAP(() => {
        gsap.to(confirmRidePanelRef.current, { transform: confirmRidePanel ? 'translateY(0)' : 'translateY(110%)', duration: 0.7, ease: 'expo.out' });
    }, [confirmRidePanel]);

    useGSAP(() => {
        gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? 'translateY(0)' : 'translateY(110%)', duration: 0.7, ease: 'expo.out' });
    }, [vehicleFound]);

    useGSAP(() => {
        gsap.to(waitingForDriverRef.current, { transform: waitingForDriver ? 'translateY(0)' : 'translateY(110%)', duration: 0.7, ease: 'expo.out' });
    }, [waitingForDriver]);

    const findTrip = async () => {
        if (!pickup || !destination) return;
        setVehiclePanel(true);
        setPanelOpen(false);
        try {
            const response = await axios.get(`/api/rides/get-fare`, {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFare(response.data);
            if (response.data?.route?.coordinates) {
                const formattedRoute = response.data.route.coordinates.map((coord: any) => [coord[1], coord[0]]);
                setRoute(formattedRoute);
            }
        } catch (error) {
            console.error('Error finding trip:', error);
            setVehiclePanel(false);
        }
    };

    const createRide = async () => {
        try {
            const response = await axios.post(`/api/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log("Ride created:", response.data);
            setVehicleFound(true);
            setConfirmRidePanel(false);
        } catch (error) {
            console.error('Error creating ride:', error);
        }
    };

    return (
        <div className='h-screen relative overflow-hidden bg-[#fafbff] font-sans selection:bg-indigo-100 selection:text-indigo-900'>

            {/* Top Command Bar */}
            <div className='absolute top-0 left-0 w-full z-[60] p-6 flex justify-between items-start pointer-events-none'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='pointer-events-auto flex items-center gap-4 bg-white/90 backdrop-blur-2xl p-2 rounded-[2rem] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] border border-white/40'
                >
                    <div className="bg-slate-900 p-3 rounded-full">
                        <img className='w-8' src="/images/logo.png" alt="Logo" />
                    </div>
                    <div className="pr-4 hidden md:block">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</h5>
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Ready to ride
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 pointer-events-auto"
                >
                    <div className="hidden lg:flex items-center gap-2 bg-white/80 backdrop-blur-xl px-5 py-3 rounded-[2rem] border border-white/40 shadow-xl shadow-black/5 mr-2">
                        <Wallet className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-black text-slate-800 tracking-tight">₹450.00</span>
                    </div>

                    <div className="flex bg-white/80 backdrop-blur-xl p-1 rounded-[2rem] border border-white/40 shadow-xl shadow-black/5">
                        <Link href='/user/profile' className='h-12 w-12 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-all'>
                            <Bell className="w-5 h-5" />
                        </Link>
                        <Link href='/user/profile' className='h-12 w-12 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-all'>
                            <Settings className="w-5 h-5" />
                        </Link>
                        <div className="w-px h-6 bg-slate-200 self-center mx-1"></div>
                        <Link href='/user/logout' className='h-12 w-12 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-all'>
                            <LogOut className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Background Layer (The Map) */}
            <div className='absolute inset-0 z-0 bg-slate-100'>
                <LiveTracking pickupLocation={pickupLocation} dropLocation={destinationLocation} route={route} />
            </div>

            {/* Central Navigation Unit (The Floating Component) */}
            <div className='absolute inset-y-0 left-0 w-full md:w-[420px] lg:w-[480px] pointer-events-none z-[50] flex flex-col justify-end p-4 md:p-8'>
                <div className='pointer-events-auto relative max-h-full flex flex-col'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-y-auto no-scrollbar border border-slate-100/50 flex flex-col relative'
                    >
                        {/* Decorative Gradient Bar */}
                        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-yellow-400 to-indigo-500 sticky top-0 z-10"></div>

                        <div className='p-8 md:p-10'>
                            <div className="flex justify-between items-end mb-10">
                                <div>
                                    <h4 className='text-4xl font-black text-slate-900 tracking-tighter'>Search.</h4>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">New Trip Request</p>
                                </div>
                                {panelOpen && (
                                    <button onClick={() => setPanelOpen(false)} className="mb-2 p-3 bg-slate-100 rounded-2xl text-slate-500 hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95">
                                        <X className="w-6 h-6" />
                                    </button>
                                )}
                            </div>

                            <form onSubmit={(e) => e.preventDefault()} className="relative space-y-6">
                                {/* The Connection Line */}
                                <div className="absolute left-[24px] top-[32px] bottom-[32px] w-[3px] bg-indigo-50 flex flex-col justify-between items-center py-4">
                                    <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                </div>

                                <div className="relative group">
                                    <input
                                        onClick={() => { setPanelOpen(true); setActiveField('pickup'); }}
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                        className='w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-3xl text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300 shadow-sm shadow-black/5'
                                        type="text" placeholder='Your starting point...'
                                    />
                                </div>
                                <div className="relative group">
                                    <input
                                        onClick={() => { setPanelOpen(true); setActiveField('destination'); }}
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className='w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-3xl text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300 shadow-sm shadow-black/5'
                                        type="text" placeholder='Where are you headed?'
                                    />
                                </div>
                            </form>

                            <button
                                onClick={findTrip}
                                className='w-full bg-slate-900 text-white rounded-[2rem] py-6 font-black mt-10 flex items-center justify-center gap-3 hover:bg-black active:scale-[0.98] transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest text-sm relative overflow-hidden group'
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Search className="w-5 h-5 relative z-10" /> <span className="relative z-10">Check Availability</span>
                            </button>
                        </div>

                        {/* Search Results Expansion */}
                        <div ref={panelRef} className='h-0 opacity-0 overflow-hidden bg-white px-8 pb-8'>
                            <div className="h-px bg-slate-100 mb-6"></div>
                            <LocationSearchPanel
                                suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                                setPanelOpen={setPanelOpen}
                                setVehiclePanel={setVehiclePanel}
                                setPickup={setPickup}
                                setDestination={setDestination}
                                activeField={activeField}
                                setPickupLocation={setPickupLocation}
                                setDestinationLocation={setDestinationLocation}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Overlays / Action Sheets (Neo-Sheets) */}
            <div ref={vehiclePanelRef} className='fixed bottom-0 left-0 w-full md:left-8 md:bottom-8 md:w-[420px] lg:w-[460px] z-[70] translate-y-full px-6 pb-6 md:px-0 md:pb-0 pointer-events-none'>
                <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] p-8 md:p-10 pointer-events-auto border border-slate-100/50">
                    <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
                </div>
            </div>

            <div ref={confirmRidePanelRef} className='fixed bottom-0 left-0 w-full md:left-8 md:bottom-8 md:w-[420px] lg:w-[460px] z-[80] translate-y-full px-6 pb-6 md:px-0 md:pb-0 pointer-events-none'>
                <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] p-8 md:p-10 pointer-events-auto border border-slate-100/50">
                    <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
                </div>
            </div>

            <div ref={vehicleFoundRef} className='fixed bottom-0 left-0 w-full md:left-8 md:bottom-8 md:w-[420px] lg:w-[460px] z-[90] translate-y-full px-6 pb-6 md:px-0 md:pb-0 pointer-events-none'>
                <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] p-8 md:p-10 pointer-events-auto border border-slate-100/50">
                    <LookingForDriver setVehicleFound={setVehicleFound} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} />
                </div>
            </div>

            <div ref={waitingForDriverRef} className='fixed bottom-0 left-0 w-full md:left-8 md:bottom-8 md:w-[420px] lg:w-[460px] z-[100] translate-y-full px-6 pb-6 md:px-0 md:pb-0 pointer-events-none'>
                <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] p-8 md:p-10 pointer-events-auto border border-slate-100/50 text-slate-800">
                    <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
                </div>
            </div>

            {/* Subtle Texture/Grain */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
};

export default Home;
