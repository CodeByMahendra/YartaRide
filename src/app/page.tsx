'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Navigation, Star, MapPin } from 'lucide-react';

export default function Start() {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans overflow-x-hidden">
      {/* Premium Light Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          className="h-full w-full object-cover scale-110 blur-[1px] opacity-20 transition-all duration-1000 grayscale hover:grayscale-0"
          src="https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=2670&auto=format&fit=crop"
          alt="Cityscape"
        />
        {/* Soft Mesh Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/80 via-white/40 to-indigo-100/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col gap-6 md:gap-20 p-4 md:p-16 lg:p-24">

        {/* Global Navigation Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/60 px-3 py-2 rounded-2xl shadow-sm">
            <img className="w-16 md:w-24 opacity-90" src="/images/logo.png" alt="YatraRide" />
            <div className="h-5 w-[1px] bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-widest text-indigo-600 uppercase leading-none">Platinum</span>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-semibold text-emerald-600 uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="text-slate-700 font-semibold text-xs border border-slate-200 bg-white/90 px-4 py-2 rounded-full shadow-sm">Login</Link>
            <div className="hidden md:flex gap-8 items-center ml-4">
              {['Safety', 'Cities', 'Help'].map((item) => (
                <Link key={item} href="#" className="text-slate-500 hover:text-indigo-600 text-xs font-semibold transition-all uppercase">{item}</Link>
              ))}
              <Link href="/signup" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Main Hero */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-white/80 border border-slate-100 shadow-sm">
              <Star className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">India's Premium Choice</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 leading-tight tracking-tight mb-4 italic">
              TRAVEL<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">LUXE.</span>
            </h1>

            <p className="text-sm md:text-lg text-slate-500 font-medium max-w-sm md:max-w-xl leading-relaxed mb-8 border-l-4 border-indigo-500 pl-4">
              A refined ride-sharing ecosystem. Merging elite service, innovative tech, and absolute safety for the modern commuter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/login" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg hover:bg-indigo-600 active:scale-[0.98] uppercase tracking-wide flex items-center justify-center gap-2">
              <span>Book a Ride</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/captain-login" className="bg-white text-slate-800 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:bg-slate-50 uppercase tracking-wide border border-slate-200 shadow-sm flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" />
              <span>Drive with Us</span>
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid - visible on larger screens only */}
        <div className="hidden lg:grid absolute right-16 bottom-16 grid-cols-2 gap-3 max-w-sm z-20">
          {[
            { icon: Shield, title: "Verified Captains", desc: "Background checked & rated drivers." },
            { icon: Clock, title: "Fast Pickup", desc: "Avg. 4 min arrival in your city." }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + (i * 0.15) }}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                <feat.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm mb-0.5">{feat.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-[10px] font-medium text-slate-300 tracking-wider mt-auto pb-2">
          © 2026 <span className="text-indigo-500">YatraRide</span>. All rights reserved.
        </div>
      </div>
    </div>
  );
}
