'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch('/api/notifications', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(0);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            markAllAsRead();
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={handleToggle}
                className={`p-2.5 relative rounded-full transition-all active:scale-90 ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 rounded-full text-[9px] font-black text-white flex items-center justify-center border-2 border-white shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for closing */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-[340px] max-h-[480px] flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden"
                        >
                            <div className="p-6 pb-2 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-xl z-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">Activity.</h3>
                                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1">Live Updates</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
                                {notifications.length === 0 ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-center px-8">
                                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-4 border border-slate-100">
                                            <Bell className="w-7 h-7 text-slate-200" />
                                        </div>
                                        <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest leading-loose">No mission updates detected at this moment.</p>
                                    </div>
                                ) : (
                                    notifications.map((notif: any) => (
                                        <div 
                                            key={notif._id} 
                                            className={`p-5 rounded-3xl transition-all ${notif.isRead ? 'bg-white opacity-40 grayscale-[0.5]' : 'bg-slate-50 border border-slate-100 shadow-sm'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2 gap-4">
                                                <div className="flex-1">
                                                    <h4 className="text-[13px] font-black text-slate-900 tracking-tight leading-tight">{notif.title}</h4>
                                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                                                        {notif.message}
                                                    </p>
                                                </div>
                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tight whitespace-nowrap mt-0.5">
                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
                                <button className="w-full py-3 bg-white text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] rounded-2xl border border-slate-100 hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                                    <Info className="w-3.5 h-3.5" /> View Matrix Log
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
