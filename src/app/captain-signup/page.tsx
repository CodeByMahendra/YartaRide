'use client';
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Lock, ArrowRight, ArrowLeft,
    Car, Palette, Hash, ShieldCheck, Briefcase,
    Loader2, Info
} from 'lucide-react';

const CaptainSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vehicleColor, setVehicleColor] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('car');
    const [vehicleCapacity, setVehicleCapacity] = useState('4');
    const [gender, setGender] = useState('male');
    const [referralCode, setReferralCode] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { setCaptain } = useContext(CaptainDataContext);
    const router = useRouter();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const newCaptain = {
                fullname: { firstname: firstName, lastname: lastName },
                email,
                password,
                gender,
                referralCode,
                vehicle: {
                    color: vehicleColor,
                    plate: vehiclePlate,
                    vehicleType,
                    capacity: parseInt(vehicleCapacity)
                }
            };

            const response = await axios.post('/api/captain/register', newCaptain);
            if (response.status === 201) {
                const data = response.data;
                setCaptain(data.captain);
                localStorage.setItem('token', data.token);
                router.push('/captain-home');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Check vehicle details and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-900 font-sans overflow-hidden">

            {/* Left Section - Narrative for Captains */}
            <div className="hidden lg:flex lg:w-[40%] relative bg-slate-950 items-center justify-center p-16 overflow-hidden border-r border-indigo-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/20"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

                <div className="relative z-10 w-full max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-12">
                            <h1 className="text-4xl font-black tracking-tight">
                                <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                                    Yatra
                                </span>
                                <span className="text-white">
                                    Ride
                                </span>
                            </h1>
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter mb-8">
                            BECOME AN<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">ELITE PILOT.</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                            Join the ranks of India's most trusted professional captains. Earn better, drive smarter, and control your time.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: ShieldCheck, label: "Full Insurance Cover" },
                                { icon: Briefcase, label: "Weekly Payouts" },
                            ].map((it, idx) => (
                                <div key={idx} className="flex items-center gap-4 text-slate-300">
                                    <it.icon className="w-5 h-5 text-indigo-400" />
                                    <span className="text-sm font-bold uppercase tracking-widest">{it.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Form Section - Multi-step style detail form */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-4 md:p-12 lg:p-20 bg-slate-900 overflow-y-auto no-scrollbar">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl py-10"
                >
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 shadow-2xl shadow-indigo-500/10 border border-indigo-500/20">

                        <div className="mb-12 flex justify-between items-start">
                            <div>
                                <Link href="/captain-login" className="inline-flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-all hover:text-indigo-300">
                                    <ArrowLeft className="w-4 h-4" /> Back to Login
                                </Link>
                                <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Partner Onboarding.</h1>
                                <p className="text-slate-400 font-medium">Register your vehicle and start earning today.</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20">
                                <Car className="w-8 h-8" />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8">
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl text-xs font-bold leading-relaxed">
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="space-y-10">

                            {/* Personal Details Section */}
                            <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-3">Personal Information</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text" required value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600"
                                        placeholder="Full First Name"
                                    />
                                    <input
                                        type="text" required value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600"
                                        placeholder="Surname"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email" required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-16 pr-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600"
                                        placeholder="Official Email Identifier"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="password" required value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600"
                                            placeholder="Secure Access Password"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <select
                                            required value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="w-full px-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="others">Others</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text" value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value)}
                                        className="w-full pl-16 pr-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600"
                                        placeholder="Referral Code (Optional)"
                                    />
                                </div>
                            </div>

                            {/* Vehicle Details Section */}
                            <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-3">Vehicle Credentials</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                                            <Palette className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text" required value={vehicleColor}
                                            onChange={(e) => setVehicleColor(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600"
                                            placeholder="Vehicle Color"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text" required value={vehiclePlate}
                                            onChange={(e) => setVehiclePlate(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600"
                                            placeholder="License Plate No."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Fleet Class</label>
                                        <div className="relative">
                                            <select
                                                required value={vehicleType}
                                                onChange={(e) => setVehicleType(e.target.value)}
                                                className="w-full px-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="car">Yatra Luxe (Car)</option>
                                                <option value="auto">Yatra Auto (Tuk-Tuk)</option>
                                                <option value="moto">Yatra Moto (Motorcycle)</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Max Seating</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="number" required min="1" value={vehicleCapacity}
                                                onChange={(e) => setVehicleCapacity(e.target.value)}
                                                className="w-full pl-16 pr-8 py-5 bg-slate-950 border-2 border-transparent focus:border-indigo-500 focus:bg-slate-900 rounded-3xl text-sm font-bold text-white transition-all outline-none placeholder:text-slate-600"
                                                placeholder="e.g. 4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 p-6 rounded-[2.5rem] border border-indigo-500/20 flex items-start gap-4">
                                <Info className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                    By onboarding, you authenticate that all vehicle documents are valid and original. Misrepresentation will lead to permanent suspension.
                                </p>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full group relative bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98] transition-all disabled:opacity-70 overflow-hidden"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 uppercase tracking-widest leading-none">Complete Onboarding</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CaptainSignup;
