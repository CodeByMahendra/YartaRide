'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Navigation, Star, MapPin } from 'lucide-react';

export default function Start() {
  return (
    <div className="relative min-h-screen w-full bg-black font-sans overflow-x-hidden">
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-60"
          src="https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=2670&auto=format&fit=crop"
          alt="City Night"
        />
        {/* Mesh Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 via-transparent to-indigo-500/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col gap-12 md:gap-20 p-6 md:p-16 lg:p-24">

        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center"
        >
          <div className="flex flex-col gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 bg-slate-950/50 backdrop-blur-3xl border border-white/10 px-6 py-4 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)] relative group overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform"></div>
              <img className="w-24 md:w-32 opacity-90 group-hover:opacity-100 transition-opacity translate-z-0 brightness-0 invert" src="/images/logo.png" alt="YatraRide" />
              <div className="h-6 w-[1px] bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.3em] text-indigo-300 uppercase leading-none">Premium</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Live Now</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md"
            >
              <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
              <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.15em]">India's Leading Choice</span>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link href="/login" className="md:hidden text-white/80 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md bg-white/5 hover:bg-indigo-600 transition-all">Login</Link>

            <div className="hidden md:flex gap-10 items-center">
              {['About', 'Safety', 'Cities'].map((item) => (
                <Link key={item} href="#" className="text-slate-400 hover:text-white text-xs font-bold transition-all tracking-[0.1em] uppercase hover:tracking-[0.15em]">{item}</Link>
              ))}
              <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
              <Link href="/login" className="text-white/80 hover:text-white text-xs font-bold transition-all tracking-[0.1em] uppercase hover:text-indigo-400">Login</Link>
              <Link href="/signup" className="relative group overflow-hidden bg-white text-slate-950 px-8 py-4 rounded-full text-[10px] font-black transition-all uppercase tracking-widest shadow-2xl hover:shadow-indigo-500/50 active:scale-95">
                <span className="relative z-10 group-hover:text-indigo-600 transition-colors">Apply For Membership</span>
                <div className="absolute inset-0 bg-indigo-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Main Hero Section */}
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-9xl lg:text-[8rem] font-black text-white leading-[0.85] tracking-tighter mb-10 italic">
              MOVE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-200 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">FASTER.</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-xl leading-relaxed mb-16 px-1 border-l-2 border-indigo-500/50 pl-6">
              The redefined ride-sharing experience. Combining luxury, technology, and absolute reliability for the modern commuter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/login" className="group w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-10 py-5 rounded-[2rem] text-sm font-black transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_60px_rgba(79,70,229,0.5)] active:scale-[0.98] uppercase tracking-widest border border-indigo-400/20 flex items-center justify-center gap-3 relative overflow-hidden">
              <span className="relative z-10">Start Your Journey</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <Link href="/captain-login" className="group w-full sm:w-auto bg-slate-900/40 backdrop-blur-md text-white px-10 py-5 rounded-[2rem] text-sm font-black transition-all hover:bg-slate-900/60 uppercase tracking-widest border border-white/10 flex items-center justify-center gap-3">
              Become a Captain
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid (Floating) */}
        <div className="hidden lg:grid absolute right-24 bottom-24 grid-cols-2 gap-4 max-w-lg z-20">
          {[
            {
              icon: Shield,
              title: "Secure Every Mile",
              desc: "Encrypted trips & verified captains.",
              col: "text-indigo-400",
              border: "border-indigo-500/20"
            },
            {
              icon: Clock,
              title: "Zero Wait Time",
              desc: "Priority dispatch for members.",
              col: "text-indigo-300",
              border: "border-indigo-400/20"
            }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (i * 0.2) }}
              whileHover={{ y: -5 }}
              className={`bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border ${feat.border} shadow-2xl hover:bg-slate-900/60 transition-all group`}
            >
              <feat.icon className={`w-8 h-8 ${feat.col} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="text-white font-black italic tracking-tighter text-xl mb-1">{feat.title}</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer info */}
        <div className="absolute bottom-10 left-10 md:left-24 text-[10px] font-black uppercase text-slate-500/50 tracking-[0.2em] z-10">
          <p>© 2026 YatraRide Inc. All Systems Operational.</p>
        </div>
      </div>
    </div>
  );
}
