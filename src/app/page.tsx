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
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 via-transparent to-yellow-500/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col gap-20 p-8 md:p-16 lg:p-24">

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
              className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 px-6 py-4 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] relative group overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform"></div>
              <img className="w-24 md:w-32 opacity-90 group-hover:opacity-100 transition-opacity translate-z-0" src="/images/logo.png" alt="YatraRide" />
              <div className="h-6 w-[1px] bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase leading-none">Premium</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-widest">Live Now</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-yellow-500/5 border border-yellow-500/20 backdrop-blur-md"
            >
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[9px] font-black text-yellow-500/90 uppercase tracking-[0.15em]">India's Leading Choice</span>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link href="/login" className="md:hidden text-white/80 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md bg-white/5">Login</Link>

            <div className="hidden md:flex gap-10 items-center">
              {['About', 'Safety', 'Cities'].map((item) => (
                <Link key={item} href="#" className="text-white/40 hover:text-white text-xs font-bold transition-all tracking-[0.1em] uppercase">{item}</Link>
              ))}
              <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
              <Link href="/login" className="text-white/80 hover:text-white text-xs font-bold transition-all tracking-[0.1em] uppercase">Login</Link>
              <Link href="/signup" className="relative group overflow-hidden bg-white text-black px-8 py-4 rounded-full text-[10px] font-black transition-all uppercase tracking-widest shadow-2xl hover:shadow-indigo-500/20 active:scale-95">
                <span className="relative z-10 group-hover:text-indigo-600 transition-colors">Apply For Membership</span>
                <div className="absolute inset-0 bg-slate-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
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


            <h1 className="text-7xl md:text-9xl lg:text-[8rem] font-black text-white leading-[0.85] tracking-tighter mb-10 italic">
              MOVE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-white to-indigo-400 drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]">FASTER.</span>
            </h1>

            <p className="text-lg md:text-2xl text-white/50 font-medium max-w-xl leading-relaxed mb-16 px-1 border-l-2 border-indigo-600/30">
              The redefined ride-sharing experience. Combining luxury, technology, and absolute reliability for the modern commuter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link
              href='/login'
              className="group relative flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-12 py-7 text-xl font-black text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-wider">
                Start Your Journey <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>

            <Link
              href='/captain-login'
              className="flex items-center justify-center px-12 py-7 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl text-white font-black hover:bg-white/10 transition-all uppercase tracking-widest text-sm group"
            >
              <span className="group-hover:text-indigo-400 transition-colors">Become a Captain</span>
            </Link>
          </motion.div>
        </div>

        {/* Footer Section - Stats & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 pt-16 border-t border-white/10 mt-auto"
        >
          {[
            { icon: Shield, val: "Secure", label: "Military-Grade Safety", color: "indigo-400" },
            { icon: Clock, val: "5 Min", label: "Maximum Wait Time", color: "yellow-400" },
            { icon: Navigation, val: "24/7", label: "Elite Concierge", color: "indigo-400" },
            { icon: MapPin, val: "Nationwide", label: "Available in 50+ Cities", color: "yellow-400" },
          ].map((item, idx) => (
            <div key={idx} className="group flex items-start gap-5">
              <div className={`p-4 rounded-2xl bg-${item.color}/5 border border-${item.color}/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-${item.color}/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                <item.icon className={`w-6 h-6 text-${item.color}`} />
              </div>
              <div className="space-y-1">
                <span className="text-xl font-black text-white tracking-tight">{item.val}</span>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{item.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Effects */}
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-yellow-400/5 rounded-full blur-[200px] pointer-events-none"></div>
    </div>
  );
}

