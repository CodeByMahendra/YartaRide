'use client';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { CaptainDataContext } from '@/context/CaptainDataContext';
import {
    User, Mail, Phone, Calendar, Clock, Shield, LogOut, ArrowLeft,
    Wallet, Star, ChevronRight, Navigation, Award, Camera, Loader2, Car
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CaptainProfilePage() {
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [stats, setStats] = useState<any>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfileAndStats = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    if (!captain || !captain._id) {
                        const profileRes = await axios.get('/api/captain/profile', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (setCaptain) setCaptain(profileRes.data.captain);
                    }

                    const statsRes = await axios.get('/api/captain/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (statsRes.data.stats) setStats(statsRes.data.stats);
                } catch (err: any) {
                    console.error("Session restore failed:", err);
                    if (err.response?.status === 401) {
                        localStorage.removeItem('token');
                        router.push('/captain-login');
                    }
                }
            } else {
                router.push('/captain-login');
            }
        };
        fetchProfileAndStats();
    }, [captain, setCaptain, router]);

    useEffect(() => {
        if (captain?.profileImage) setAvatarPreview(captain.profileImage);
    }, [captain?.profileImage]);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            setAvatarPreview(base64);
            setAvatarLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post('/api/captain/upload-avatar',
                    { imageBase64: base64 },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (setCaptain) setCaptain((prev: any) => ({ ...prev, profileImage: res.data.profileImage }));
                setAvatarPreview(res.data.profileImage);
            } catch (err: any) {
                alert(err.response?.data?.message || 'Upload failed');
                setAvatarPreview(captain?.profileImage || '');
            } finally {
                setAvatarLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    if (!captain) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center max-w-sm w-full shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                        <Car className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Captain Sign In</h2>
                    <p className="text-slate-500 mb-5 text-xs">Sign in to view your captain profile and earnings.</p>
                    <button
                        onClick={() => router.push('/captain-login')}
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors"
                    >
                        Go to Captain Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-16">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/captain-home')}
                            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">Captain Profile</h1>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/captain-login');
                        }}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div
                                onClick={handleAvatarClick}
                                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-slate-100 border-2 border-indigo-100 overflow-hidden flex items-center justify-center cursor-pointer group relative"
                            >
                                {avatarPreview || captain.profileImage ? (
                                    <img src={avatarPreview || captain.profileImage} alt="Captain" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-slate-400" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    {avatarLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                                </div>
                            </div>
                            <button
                                onClick={handleAvatarClick}
                                className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-sm"
                            >
                                <Camera className="w-3 h-3" />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                                {captain.fullname?.firstname} {captain.fullname?.lastname}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-bold">
                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                    {stats?.rating || captain.rating || '4.9'}
                                </span>
                                <span className="text-xs text-slate-500 font-medium capitalize">
                                    {captain?.vehicle?.vehicleType} Captain
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Earnings & Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                        <p className="text-xs text-slate-500">Earnings</p>
                        <p className="text-base sm:text-lg font-bold text-indigo-600 mt-0.5">₹{stats?.totalEarnings || 0}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                        <p className="text-xs text-slate-500">Total Trips</p>
                        <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{stats?.ridesCount || 0}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                        <p className="text-xs text-slate-500">Online</p>
                        <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{stats?.hoursOnline || '0'}h</p>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Vehicle Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block font-medium">Type</span>
                            <span className="font-bold text-slate-800 capitalize mt-0.5 block">{captain?.vehicle?.vehicleType || 'Car'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block font-medium">Plate Number</span>
                            <span className="font-bold text-slate-800 uppercase mt-0.5 block">{captain?.vehicle?.plate || 'N/A'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block font-medium">Color</span>
                            <span className="font-bold text-slate-800 capitalize mt-0.5 block">{captain?.vehicle?.color || 'N/A'}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block font-medium">Status</span>
                            <span className="font-bold text-emerald-600 mt-0.5 block">Approved & Active</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
                    <Link href="/wallet" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800">Earnings & Payouts</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link href="/messages" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Navigation className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800">Messages & Support</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                </div>
            </div>
        </div>
    );
}