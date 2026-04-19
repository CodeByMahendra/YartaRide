'use client';
import React from 'react';
import { Home, Map, MessageSquare, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const BottomNav = ({ type = 'user' }: { type?: 'user' | 'captain' }) => {
    const pathname = usePathname();

    const items = type === 'user' ? [
        { icon: Home, label: 'Home', href: '/home' },
        { icon: Clock, label: 'Activity', href: '/user/rides' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: User, label: 'Account', href: '/user/profile' },
    ] : [
        { icon: Map, label: 'Dashboard', href: '/captain-home' },
        { icon: Clock, label: 'Earnings', href: '/captain/earnings' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: User, label: 'Profile', href: '/captain/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-[100] md:hidden">
            <div className="flex justify-around items-center h-20 px-4">
                {items.map((item, idx) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={idx} href={item.href} className="relative flex flex-col items-center justify-center gap-1 group">
                            <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div 
                                    layoutId="bottomNavDot"
                                    className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full"
                                />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default BottomNav;
