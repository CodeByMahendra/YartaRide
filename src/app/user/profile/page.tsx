'use client';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserDataContext } from '@/context/UserDataContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Clock, Shield, LogOut, ArrowLeft, Edit3, Wallet, Star, TrendingUp, ChevronRight, CreditCard, Bell, Navigation, Sparkles, Share2, Camera, Loader2 } from 'lucide-react';
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
                    // Fetch user profile if context is empty
                    if (!user || !user._id) {
                        const profileRes = await axios.get('/api/user/profile', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (setUser) setUser(profileRes.data.user);
                    }

                    // Fetch stats
                    const statsRes = await axios.get('/api/user/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStats(statsRes.data.stats);
                } catch (err) {
                    console.error("Session restore failed:", err);
                }
            }
        };
        fetchProfileAndStats();
    }, [user, setUser]);

    // Set initial preview from existing profileImage
    useEffect(() => {
        if (user?.profileImage) setAvatarPreview(user.profileImage);
    }, [user?.profileImage]);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }

        // Show local preview immediately
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
                // Update user context with new URL
                if (setUser) setUser((prev: any) => ({ ...prev, profileImage: res.data.profileImage }));
                setAvatarPreview(res.data.profileImage);
            } catch (err: any) {
                alert(err.response?.data?.message || 'Upload failed');
                setAvatarPreview(user?.profileImage || '');
            } finally {
                setAvatarLoading(false);
                // Reset input so same file can be re-selected
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    if (!user || !user.email) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 p-8 rounded-[2.5rem] text-center max-w-md w-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
                >
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Access Reserved.</h2>
                    <p className="text-slate-500 mb-8 text-sm font-medium">Please authorize your identity to access the mobility command center.</p>
                    <Link href="/login" className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95">
                        Authorize Identity
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-12">

            {/* Premium Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/home" className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all text-sm font-black uppercase tracking-widest">
                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Titanium Grade</span>
                        </div>
                        <button className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-all text-slate-400 shadow-sm">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Left Sidebar - Profile Command */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                            <div className="flex flex-col items-center text-center relative z-10">
                                {/* Clickable Avatar with Camera overlay */}
                                <div className="relative mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleAvatarClick}
                                        className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border-[6px] border-white shadow-2xl overflow-hidden ring-1 ring-slate-100 cursor-pointer relative group"
                                    >
                                        {avatarPreview || user.profileImage ? (
                                            <img src={avatarPreview || user.profileImage} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <User className="w-14 h-14" />
                                            </div>
                                        )}
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {avatarLoading
                                                ? <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                : <Camera className="w-8 h-8 text-white" />}
                                        </div>
                                    </motion.div>
                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <div className="absolute -bottom-2 right-2 w-10 h-10 bg-emerald-500 rounded-[1.25rem] border-[4px] border-white shadow-lg flex items-center justify-center text-white">
                                        <Shield className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                                {/* Upload hint text */}
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tap photo to change</p>

                                <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">
                                    {user?.fullname?.firstname} {user?.fullname?.lastname}
                                </h1>
                                <div className="flex items-center gap-2 text-indigo-600 mb-10">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                        {(stats?.ridesCount || 0) > 10 ? 'Elite Member' : 'Prime Member'}
                                    </span>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-0.5">Contact</p>
                                                <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-0.5">Deployment</p>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                                    <Edit3 className="w-4 h-4" /> Modify Profile
                                </button>
                            </div>
                        </motion.div>

                        <div className="bg-white rounded-[2rem] p-2 border border-slate-100 shadow-lg">
                            <Link href="/user/logout" className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all group">
                                <span className="flex items-center gap-4 font-black uppercase tracking-widest text-[10px]">
                                    <LogOut className="w-5 h-5" /> De-Authorize Account
                                </span>
                                <ChevronRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Content - Analytics Command */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Premium Wallet Hub */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-600/5 -skew-x-12 translate-x-1/4 group-hover:translate-x-1/3 transition-transform duration-[2s]"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Available Credits</span>
                                    </div>
                                    <h2 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">₹{stats?.walletBalance?.toLocaleString() || '0'}</h2>
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Standard Rail
                                        </div>
                                        <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                            Auto-Replenish Active
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] hover:bg-indigo-700 transition-all flex items-center gap-4"
                                >
                                    <TrendingUp className="w-5 h-5" /> Add Capital
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Strategic Analytics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Missions', value: stats?.ridesCount || '0', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { label: 'Distance Covered', value: (stats?.totalDistance || '0') + ' km', icon: Navigation, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Capital Spent', value: '₹' + (stats?.totalSpent?.toLocaleString() || '0'), icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
                                { label: 'Free Rides', value: user?.freeRides || '0', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-50' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-md hover:shadow-2xl transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-10 group-hover:rotate-6 transition-all relative z-10`}>
                                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                                    </div>
                                    <p className="text-4xl font-black text-slate-900 mb-2 tracking-tighter relative z-10">{stat.value}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Advanced Security Protocol Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-inner">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-black tracking-tight mb-2 italic">Guardian Protocol.</h3>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose max-w-sm">Active 256-bit encryption for all logistics and transaction records.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                                    {['Encrypted', 'Biometric', '2FA Active', 'Secure'].map((item, i) => (
                                        <div key={i} className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest text-center">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Refer and Earn Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-amber-400 rounded-[3.5rem] p-12 text-slate-900 relative overflow-hidden shadow-xl shadow-amber-400/20"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <Share2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tighter italic">Refer & Earn</h3>
                                </div>
                                <p className="text-slate-800 font-medium mb-8 max-w-md">
                                    Share your exclusive code with friends! They get <b>2 Free Rides</b> upon signup, and you get <b>1 Free Ride</b> after they complete their first trip. Win-Win!
                                </p>

                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="px-8 py-5 bg-black/5 rounded-2xl border-2 border-black/10 border-dashed text-center min-w-[200px]">
                                        <p className="text-[10px] uppercase tracking-widest font-black mb-1 opacity-60">Your Code</p>
                                        <p className="text-3xl font-black tracking-widest">{user?.referralCode || 'N/A'}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => window.open(`https://wa.me/?text=Hey! Join YatraRide and get 2 free rides instantly. Use my referral code: ${user?.referralCode} when signing up!`)} className="p-4 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm text-green-600 hover:-translate-y-1">
                                            <i className="ri-whatsapp-fill text-xl"></i>
                                        </button>
                                        <button onClick={() => window.open(`https://t.me/share/url?url=https://yatraride.com&text=Hey! Join YatraRide and get 2 free rides instantly. Use my referral code: ${user?.referralCode} when signing up!`)} className="p-4 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm text-blue-500 hover:-translate-y-1">
                                            <i className="ri-telegram-fill text-xl"></i>
                                        </button>
                                        <button onClick={() => {
                                            navigator.clipboard.writeText(`Hey! Join YatraRide and get 2 free rides instantly. Use my referral code: ${user?.referralCode} when signing up!`);
                                            alert('Copied to clipboard! Ready to share on Instagram or any other app.');
                                        }} className="p-4 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm text-pink-600 hover:-translate-y-1">
                                            <i className="ri-instagram-fill text-xl"></i>
                                        </button>
                                        <button onClick={() => window.open(`mailto:?subject=Get Free Rides on YatraRide&body=Hey! Join YatraRide and get 2 free rides instantly. Use my referral code: ${user?.referralCode} when signing up!`)} className="p-4 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm text-red-500 hover:-translate-y-1">
                                            <i className="ri-mail-fill text-xl"></i>
                                        </button>
                                    </div>
                                </div>

                                {stats?.referredFriends && stats.referredFriends.length > 0 && (
                                    <div className="mt-10 border-t border-slate-900/10 pt-8">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest mb-4 text-slate-800">Your Referral History</h4>
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {stats.referredFriends.map((friend: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between bg-white/40 p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm uppercase shadow-sm">
                                                            {friend.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm text-slate-900 tracking-tight">{friend.name}</p>
                                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Joined {new Date(friend.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${friend.hasCompletedFirstRide ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/30' : 'bg-slate-900/10 text-slate-700 border border-slate-900/10'}`}>
                                                        {friend.hasCompletedFirstRide ? '+1 Ride Earned' : 'Pending Ride'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}
