'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CaptainLogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Simple logout for captain: clear token and redirect
        localStorage.removeItem('token');
        router.push('/captain-login');
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase italic">Terminating Captain Session...</h2>
                <p className="text-slate-500 text-xs font-bold mt-4 uppercase tracking-[0.2em]">Safe travels, Captain.</p>
            </div>
        </div>
    );
}
