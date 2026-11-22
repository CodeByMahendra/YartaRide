'use client';
import React from 'react';
import { Home, Map, MessageSquare, User, Clock, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BottomNav = ({ type = 'user' }: { type?: 'user' | 'captain' }) => {
    const pathname = usePathname();

    const items = type === 'user' ? [
        { icon: Home, label: 'Home', href: '/home' },
        { icon: Clock, label: 'Rides', href: '/ride-history' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: User, label: 'Account', href: '/user/profile' },
    ] : [
        { icon: Map, label: 'Home', href: '/captain-home' },
        { icon: Wallet, label: 'Wallet', href: '/wallet' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: User, label: 'Profile', href: '/captain/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 z-[90] md:hidden">
            <div className="flex justify-around items-center h-16 px-2">
                {items.map((item, idx) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-16 py-1 transition-colors ${
                                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                            <span className="text-[11px] leading-tight">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;