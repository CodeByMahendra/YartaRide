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
import BottomNav from '@/components/BottomNav';
import { SocketDataContext } from '@/context/SocketContext';
import { UserDataContext } from '@/context/UserDataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LiveTracking from '@/components/LiveTracking';
import NotificationBell from '@/components/NotificationBell';
import { User, LogOut, Navigation, Search, Menu, X, ChevronDown, Bell, Shield, Settings, Wallet, MapPin, MessageSquare, Star, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

const Home = () => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
    
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false);
    const [vehicleFound, setVehicleFound] = useState(false);
    const [waitingForDriver, setWaitingForDriver] = useState(false);

    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeField, setActiveField] = useState<'pickup' | 'destination' | null>(null);

    const [fare, setFare] = useState<any>({});
    const [vehicleType, setVehicleType] = useState<string | null>(null);
    const [rideType, setRideType] = useState<'private' | 'shared'>('private');
    const [seatsRequired, setSeatsRequired] = useState(1);
    const [ride, setRide] = useState<any>(null);
    const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(null);
    const [destinationLocation, setDestinationLocation] = useState<[number, number] | null>(null);
    const [route, setRoute] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ walletBalance: 0, ridesCount: 0 });
    const [captains, setCaptains] = useState<any[]>([]);

    const router = useRouter();
    const { socket } = useContext(SocketDataContext);
    const { user, setUser } = useContext(UserDataContext);
    const { showToast } = useToast();

    // Fetch User Profile if missing
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        if (!user || !user._id) {
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setUser(response.data.user);
                })
                .catch(err => {
                    console.error('Error fetching user profile:', err);
                    if (err.response?.status === 401) {
                        localStorage.removeItem('token');
                        router.push('/login');
                    }
                });
        }

        if (token) {
            axios.get('/api/user/stats', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data.stats) setStats(res.data.stats);
            }).catch(err => console.error("Stats fetch failed:", err));
        }
    }, [user, setUser, router]);

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setPickupLocation([latitude, longitude]);
                    try {
                        const response = await axios.get(`/api/maps/get-address-from-coordinates`, {
                            params: { ltd: latitude, lng: longitude },
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });
                        if (response.data?.address) {
                            setPickup(response.data.address);
                        }
                    } catch (error) {
                        setPickup('Current Location');
                    }
                },
                (error) => {
                    showToast('Unable to get your location. Please enable location services.', 'error');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    };

    useEffect(() => {
        if (socket && user?._id) {
            socket.emit("join", { userType: "user", userId: user._id });
        }
        if (!pickup) handleGetCurrentLocation();
    }, [user, socket]);

    useEffect(() => {
        const fetchCaptains = async () => {
            if (!pickupLocation) return;
            try {
                const response = await axios.get('/api/captain/near', {
                    params: { ltd: pickupLocation[0], lng: pickupLocation[1], radius: 50 },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setCaptains(response.data);
            } catch (error) {
                console.error('Error fetching nearby captains:', error);
            }
        };
        fetchCaptains();
        const interval = setInterval(fetchCaptains, 10000);
        return () => clearInterval(interval);
    }, [pickupLocation]);

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
        socket.on('update-location-captain', (data: any) => {
            const { userId, location } = data;
            setCaptains(prev => {
                const index = prev.findIndex(c => c._id === userId);
                if (index !== -1) {
                    const newCaptains = [...prev];
                    newCaptains[index] = {
                        ...newCaptains[index],
                        location: { ...newCaptains[index].location, coordinates: [location.lng, location.ltd] }
                    };
                    return newCaptains;
                }
                return prev;
            });
        });
        return () => {
            socket.off('ride-confirmed');
            socket.off('ride-started');
            socket.off('update-location-captain');
        };
    }, [socket]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!pickup || pickup.length < 3 || activeField !== 'pickup') {
                setPickupSuggestions([]);
                return;
            }
            try {
                const response = await axios.get(`/api/maps/get-suggestions`, {
                    params: { input: pickup, ltd: pickupLocation?.[0], lng: pickupLocation?.[1] },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setPickupSuggestions(response.data);
            } catch (error) {}
        };
        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [pickup, activeField, pickupLocation]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!destination || destination.length < 3 || activeField !== 'destination') {
                setDestinationSuggestions([]);
                return;
            }
            try {
                const response = await axios.get(`/api/maps/get-suggestions`, {
                    params: { input: destination, ltd: pickupLocation?.[0], lng: pickupLocation?.[1] },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDestinationSuggestions(response.data);
            } catch (error) {}
        };
        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [destination, activeField, pickupLocation]);

    const findTrip = async () => {
        if (!pickup || !destination) return;
        setVehiclePanel(true);
        setPanelOpen(false);
        try {
            const pickupParam = pickupLocation ? `${pickupLocation[0]},${pickupLocation[1]}` : pickup;
            const destParam = destinationLocation ? `${destinationLocation[0]},${destinationLocation[1]}` : destination;
            const response = await axios.get(`/api/rides/get-fare`, {
                params: { pickup: pickupParam, destination: destParam },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFare(response.data);
            if (response.data?.route?.coordinates) {
                const formattedRoute = response.data.route.coordinates.map((coord: any) => [coord[1], coord[0]]);
                setRoute(formattedRoute);
            }
        } catch (error) {
            setVehiclePanel(false);
        }
    };

    const createRide = async () => {
        try {
            const endpoint = rideType === 'shared' ? '/api/ride/request' : '/api/rides/create';
            const response = await axios.post(endpoint, {
                pickup,
                destination,
                pickupLocation: pickupLocation ? { lat: pickupLocation[0], lng: pickupLocation[1], ltd: pickupLocation[0] } : null,
                destinationLocation: destinationLocation ? { lat: destinationLocation[0], lng: destinationLocation[1], ltd: destinationLocation[0] } : null,
                vehicleType,
                rideType,
                seatsRequired
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.status === 'matched') {
                showToast('Matched with a co-passenger!', 'success', 'SHARED RIDE MATCH');
                setRide(response.data.ride);
                setWaitingForDriver(true);
            } else {
                setVehicleFound(true);
            }
            setConfirmRidePanel(false);
        } catch (error) {}
    };

    return (
        <div className='h-screen relative overflow-hidden bg-white font-sans selection:bg-indigo-100'>
            {/* Minimalist Top Nav */}
            <header className='absolute top-0 left-0 w-full z-[60] p-4 md:p-8 flex justify-between items-center pointer-events-none'>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='pointer-events-auto flex items-center gap-3 bg-white/95 backdrop-blur-2xl px-5 py-2.5 rounded-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border border-slate-100 md:hidden'
                >
                   <MapPin className="w-4 h-4 text-indigo-600" />
                   <span className="text-[10px] font-black tracking-widest text-slate-900 truncate max-w-[120px] uppercase">
                     {pickup || 'Locating...'}
                   </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='hidden md:flex pointer-events-auto items-center gap-4 bg-white/95 backdrop-blur-2xl px-6 py-3 rounded-full shadow-xl border border-slate-100'
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">Yatra<span className="text-indigo-600">Ride</span></h1>
                    </div>
                </motion.div>

                <div className="flex gap-2 pointer-events-auto">
                    <NotificationBell />
                    <Link href='/user/profile' className='h-12 w-12 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-2xl border border-slate-100 shadow-xl text-slate-400'>
                        <User className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            {/* Uber Style Map */}
            <div className='absolute inset-0 z-0'>
                <LiveTracking pickupLocation={pickupLocation} dropLocation={destinationLocation} route={route} captains={captains} />
            </div>

            {/* Floating Navigation Sheet (Uber/Rapido Style) */}
            <div className={`absolute bottom-0 left-0 w-full z-[80] p-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${(vehiclePanel || confirmRidePanel || vehicleFound || waitingForDriver) ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                
                {/* Visual Handle */}
                <div className="md:hidden flex justify-center pb-2">
                    <div className="w-12 h-1.5 bg-slate-400/20 rounded-full" />
                </div>

                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    className='bg-white rounded-t-[3rem] md:rounded-[3.5rem] md:max-w-xl md:mx-auto md:mb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-slate-100 px-8 pb-32 pt-8'
                >
                    <div className="mb-8">
                        <h4 className='text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight'>Where to, {user?.fullname?.firstname || 'Friend'}?</h4>
                        <p className="text-indigo-600 font-bold text-[9px] uppercase tracking-widest mt-2 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                           Smart Dispatch Active
                        </p>
                    </div>

                    <div className="relative space-y-3">
                         {/* Location Pill Group */}
                         <div className="relative">
                            <div className="absolute left-[30px] top-[30px] bottom-[30px] w-0.5 bg-slate-50 flex flex-col justify-between items-center py-1 z-10">
                                <div className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50"></div>
                                <div className="w-2.5 h-2.5 bg-slate-300 rounded-sm rotate-45"></div>
                            </div>

                            <div 
                                onClick={() => { setPanelOpen(true); setActiveField('pickup'); }}
                                className="w-full pl-18 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-white hover:shadow-lg transition-all"
                            >
                                <span className={`text-base font-bold truncate block ${pickup ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {pickup || 'Set current location'}
                                </span>
                            </div>

                            <div 
                                onClick={() => { setPanelOpen(true); setActiveField('destination'); }}
                                className="w-full pl-18 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer mt-3 hover:bg-white hover:shadow-lg transition-all"
                            >
                                <span className={`text-base font-bold truncate block ${destination ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {destination || 'Search destination'}
                                </span>
                            </div>
                         </div>
                    </div>

                    <div className="flex gap-3 mt-8 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { icon: MapPin, label: 'Add Work', col: 'text-indigo-600 bg-indigo-50' },
                            { icon: Star, label: 'Saved', col: 'text-amber-600 bg-amber-50' },
                            { icon: ArrowUp, label: 'Elevate', col: 'text-emerald-600 bg-emerald-50' }
                        ].map((s, i) => (
                            <button key={i} className={`flex items-center gap-2 ${s.col} px-6 py-3 rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest border border-black/5`}>
                                <s.icon className="w-3.5 h-3.5" /> {s.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Expanded Location Hub (Full Screen on Mobile) */}
            <AnimatePresence>
                {panelOpen && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className='fixed inset-0 z-[100] bg-white flex flex-col p-6'
                    >
                        <header className="flex justify-between items-center mb-8">
                            <button onClick={() => setPanelOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-900">
                                <X className="w-6 h-6" />
                            </button>
                            <h3 className="text-xl font-black italic tracking-tighter">PLAN TRIP.</h3>
                            <div className="w-12 h-12" />
                        </header>

                        <div className="relative space-y-4">
                             <div className="absolute left-[24px] top-[25px] bottom-[25px] w-0.5 bg-slate-100 flex flex-col justify-between items-center py-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                                <div className="w-2.5 h-2.5 bg-slate-300 rounded-sm rotate-45"></div>
                            </div>
                            <input
                                autoFocus={activeField === 'pickup'}
                                onFocus={() => setActiveField('pickup')}
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                className='w-full pl-14 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600/10 rounded-2xl text-slate-900 font-bold text-lg outline-none'
                                placeholder='Pickup Hub'
                            />
                            <input
                                autoFocus={activeField === 'destination'}
                                onFocus={() => setActiveField('destination')}
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className='w-full pl-14 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600/10 rounded-2xl text-slate-900 font-bold text-lg outline-none'
                                placeholder='Destination Matrix'
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar mt-6">
                            <LocationSearchPanel
                                suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                                setPanelOpen={setPanelOpen}
                                setVehiclePanel={setVehiclePanel}
                                setPickup={setPickup}
                                setDestination={setDestination}
                                activeField={activeField}
                                setPickupLocation={setPickupLocation}
                                setDestinationLocation={setDestinationLocation}
                                handleGetCurrentLocation={handleGetCurrentLocation}
                                setPickupSuggestions={setPickupSuggestions}
                                setDestinationSuggestions={setDestinationSuggestions}
                            />
                        </div>

                        <button
                            onClick={findTrip}
                            disabled={!pickup || !destination}
                            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-20 mb-4"
                        >
                            Confirm Selection
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Nav (Mobile Only) */}
            <BottomNav type="user" />

            {/* Slide-up Interaction Layers */}
            <AnimatePresence>
                {vehiclePanel && (
                    <motion.div
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 200 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset, velocity }) => { if (offset.y > 100 || velocity.y > 500) setVehiclePanel(false); }}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        className='fixed bottom-0 left-0 w-full md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-[600px] z-[90]'
                    >
                        <div className="bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border-t border-slate-100 overflow-hidden h-[85vh] md:h-[80vh] flex flex-col pt-3">
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
                            <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} rideType={rideType} setRideType={setRideType} seatsRequired={seatsRequired} setSeatsRequired={setSeatsRequired} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmRidePanel && (
                    <motion.div
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 200 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset, velocity }) => { if (offset.y > 100 || velocity.y > 500) setConfirmRidePanel(false); }}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        className='fixed bottom-0 left-0 w-full md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-[600px] z-[100]'
                    >
                        <div className="bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border-t border-slate-100 overflow-hidden h-[85vh] md:h-[80vh] flex flex-col pt-3">
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
                            <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {vehicleFound && (
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        className='fixed bottom-0 left-0 w-full md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-[600px] z-[110]'
                    >
                        <div className="bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border-t border-slate-100 overflow-hidden h-[85vh] md:h-[80vh] flex flex-col pt-3 text-slate-900">
                             <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
                             <LookingForDriver setVehicleFound={setVehicleFound} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {waitingForDriver && (
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        className='fixed bottom-0 left-0 w-full md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-[600px] z-[120]'
                    >
                        <div className="bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border-t border-slate-100 overflow-hidden h-[85vh] md:h-[80vh] flex flex-col pt-3 text-slate-900">
                             <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
                             <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay Matrix Grain */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default Home;
