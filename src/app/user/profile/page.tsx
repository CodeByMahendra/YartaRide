'use client';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserDataContext } from '@/context/UserDataContext';
import { motion } from 'framer-motion';
import {
    User, Mail, Calendar, Clock, Shield, LogOut, ArrowLeft,
    Wallet, Star, ChevronRight, CreditCard, Bell, Sparkles, Share2,
    Camera, Loader2, Navigation, Gift
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function ProfilePage() {
    const { user, setUser } = useContext(UserDataContext);
    const [stats, setStats] = useState<any>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    useEffect(() => {
        const fetchProfileAndStats = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    if (!user || !user._id) {
                        const profileRes = await axios.get('/api/user/profile', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (setUser) setUser(profileRes.data.user);
                    }

                    const statsRes = await axios.get('/api/user/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStats(statsRes.data.stats);
                } catch (err: any) {
                    console.error("Session restore failed:", err);
                }
            }
        };
        fetchProfileAndStats();
    }, [user, setUser]);

    useEffect(() => {
        if (user?.profileImage) setAvatarPreview(user.profileImage);
    }, [user?.profileImage]);

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
                const res = await axios.post('/api/user/upload-avatar',
                    { imageBase64: base64 },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (setUser) setUser((prev: any) => ({ ...prev, profileImage: res.data.profileImage }));
                setAvatarPreview(res.data.profileImage);
            } catch (err: any) {
                alert(err.response?.data?.message || 'Upload failed');
                setAvatarPreview(user?.profileImage || '');
            } finally {
                setAvatarLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    if (!user || !user.email) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center max-w-sm w-full shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                        <User className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Please Sign In</h2>
                    <p className="text-slate-500 mb-5 text-xs">Log in to view your profile and ride history.</p>
                    <Link href="/login" className="block w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-16">
            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/home" className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">My Profile</h1>
                    </div>
                    <Link href="/user/logout" className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1">
                        <LogOut className="w-3.5 h-3.5" /> Logout
                    </Link>
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
                                {avatarPreview || user.profileImage ? (
                                    <img src={avatarPreview || user.profileImage} alt="User" className="w-full h-full object-cover" />
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
                                {user.fullname?.firstname} {user.fullname?.lastname}
                            </h2>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                            <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
                                <Shield className="w-3 h-3 text-emerald-600" /> Verified Passenger
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                        <p className="text-xs text-slate-500">Wallet</p>
                        <p className="text-base sm:text-lg font-bold text-indigo-600 mt-0.5">₹{stats?.walletBalance || 0}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                        <p className="text-xs text-slate-500">Rides</p>
                        <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{stats?.ridesCount || 0}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                        <p className="text-xs text-slate-500">Free Rides</p>
                        <p className="text-base sm:text-lg font-bold text-amber-600 mt-0.5">{user?.freeRides || 0}</p>
                    </div>
                </div>

                {/* Account Links */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
                    <Link href="/wallet" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800">Yatra Wallet</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link href="/ride-history" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800">Ride History</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>

                    <Link href="/passes" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800">Yatra Passes</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                </div>

                {/* Referral Card */}
                {user?.referralCode && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                                <Gift className="w-5 h-5 text-amber-600" />
                                <h3 className="text-sm font-bold text-slate-900">Your Referral Code</h3>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(user.referralCode);
                                    alert('Referral code copied!');
                                }}
                                className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                            >
                                Copy
                            </button>
                        </div>
                        <p className="text-xs text-slate-600">
                            Code: <strong className="text-amber-800 font-bold">{user.referralCode}</strong> — Give friends 2 free rides, earn 1 free ride on their first trip.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}