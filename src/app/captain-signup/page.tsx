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
    Loader2, Camera, Info
} from 'lucide-react';

const CaptainSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vehicleColor, setVehicleColor] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('car');

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
                vehicle: {
                    color: vehicleColor,
                    plate: vehiclePlate,
                    vehicleType,
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
        <div className="flex min-h-screen w-full bg-white font-sans overflow-hidden">

            {/* Left Section - Narrative for Captains */}
            <div className="hidden lg:flex lg:w-[40%] relative bg-emerald-600 items-center justify-center p-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-white/5 rounded-full blur-[120px]"></div>

                <div className="relative z-10 w-full max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-5 inline-block rounded-[2.5rem] mb-12 shadow-2xl">
                            <img src="/images/logo.png" alt="YatraRide" className="w-40 brightness-0 invert" />
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter mb-8">
                            BECOME AN<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">ELITE PILOT.</span>
                        </h2>
                        <p className="text-emerald-50 text-lg font-medium leading-relaxed mb-12">
                            Join the ranks of India's most trusted professional captains. Earn better, drive smarter, and control your time.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: ShieldCheck, label: "Full Insurance Cover" },
                                { icon: Briefcase, label: "Weekly Payouts" },
                            ].map((it, idx) => (
                                <div key={idx} className="flex items-center gap-4 text-white/80">
                                    <it.icon className="w-5 h-5 text-yellow-300" />
                                    <span className="text-sm font-bold uppercase tracking-widest">{it.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Form Section - Multi-step style detail form */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-8 md:p-12 lg:p-20 bg-slate-50/50 overflow-y-auto no-scrollbar">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl py-10"
                >
                    <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-slate-100">

                        <div className="mb-12 flex justify-between items-start">
                            <div>
                                <Link href="/captain-login" className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-all">
                                    <ArrowLeft className="w-4 h-4" /> Back to Login
                                </Link>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Partner Onboarding.</h1>
                                <p className="text-slate-400 font-medium">Register your vehicle and start earning today.</p>
                            </div>
                            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                                <Car className="w-8 h-8" />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8">
                                    <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl text-xs font-bold leading-relaxed">
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="space-y-10">

                            {/* Personal Details Section */}
                            <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-3">Personal Information</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text" required value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
                                        placeholder="Full First Name"
                                    />
                                    <input
                                        type="text" required value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
                                        placeholder="Surname"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email" required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
                                        placeholder="Official Email Identifier"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password" required value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
                                        placeholder="Secure Access Password"
                                    />
                                </div>
                            </div>

                            {/* Vehicle Details Section */}
                            <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-3">Vehicle Credentials</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                            <Palette className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text" required value={vehicleColor}
                                            onChange={(e) => setVehicleColor(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
                                            placeholder="Vehicle Color"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text" required value={vehiclePlate}
                                            onChange={(e) => setVehiclePlate(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
                                            placeholder="License Plate No."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Fleet Class</label>
                                    <select
                                        required value={vehicleType}
                                        onChange={(e) => setVehicleType(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="car">Yatra Luxe (Car)</option>
                                        <option value="auto">Yatra Auto (Tuk-Tuk)</option>
                                        <option value="moto">Yatra Moto (Motorcycle)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100/50 flex items-start gap-4">
                                <Info className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                                    By onboarding, you authenticate that all vehicle documents are valid and original. Misrepresentation will lead to permanent suspension.
                                </p>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full group relative bg-emerald-600 text-white rounded-[2rem] py-6 font-black flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-2xl shadow-emerald-100 disabled:opacity-70 overflow-hidden"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 uppercase tracking-widest leading-none">Complete Onboarding</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
