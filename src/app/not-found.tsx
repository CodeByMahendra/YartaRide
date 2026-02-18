'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center max-w-lg"
            >
                <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/20 border border-indigo-500/20 relative">
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-[2rem] animate-pulse"></div>
                    <AlertCircle className="w-10 h-10 text-indigo-500" />
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-2 leading-none">404</h1>
                <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-6">Lost in Transit</h2>

                <p className="text-slate-500 mb-10 font-medium leading-relaxed">
                    The coordinates you're looking for don't exist in our navigation system. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/home" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 active:scale-95 group">
                        <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Return Home
                    </Link>
                    <button onClick={() => window.history.back()} className="px-8 py-4 bg-slate-900 text-slate-400 border border-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </motion.div>

            <div className="absolute bottom-10 text-[10px] font-black uppercase text-slate-600 tracking-[0.3em]">
                YatraRide System Error
            </div>
        </div>
    );
}
