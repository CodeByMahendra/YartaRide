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
      <div className="relative z-10 flex min-h-screen flex-col gap-12 md:gap-20 p-6 md:p-16 lg:p-24">

        {/* Global Navigation Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center"
        >
          <div className="flex flex-col gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 bg-white/70 backdrop-blur-3xl border border-white/50 px-6 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative group overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform"></div>
              <img className="w-24 md:w-32 opacity-90 group-hover:opacity-100 transition-opacity translate-z-0" src="/images/logo.png" alt="YatraRide" />
              <div className="h-6 w-[1px] bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase leading-none">Platinum</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                  <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Active Ops</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-white/80 border border-slate-100 shadow-sm backdrop-blur-md"
            >
              <Star className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">India's Premium Choice</span>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link href="/login" className="md:hidden text-slate-600 hover:text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-white px-4 py-2 rounded-full backdrop-blur-md bg-white shadow-lg shadow-black/5">Login</Link>

            <div className="hidden md:flex gap-10 items-center">
              {['Safety', 'Cities', 'Help'].map((item) => (
                <Link key={item} href="#" className="text-slate-500 hover:text-indigo-600 text-xs font-black transition-all tracking-[0.1em] uppercase hover:tracking-[0.15em]">{item}</Link>
              ))}
              <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
              <Link href="/login" className="text-slate-600 hover:text-indigo-600 text-xs font-black transition-all tracking-[0.1em] uppercase">Login</Link>
              <Link href="/signup" className="relative group overflow-hidden bg-indigo-600 text-white px-8 py-4 rounded-full text-[10px] font-black transition-all uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 active:scale-95">
                <span className="relative z-10">Get Membership</span>
                <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Main Hero (Light Theme) */}
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-9xl lg:text-[8rem] font-black text-slate-900 leading-[0.85] tracking-tighter mb-10 italic">
              TRAVEL<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-900 to-indigo-800">LUXE.</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-500 font-bold max-w-xl leading-relaxed mb-16 px-1 border-l-4 border-indigo-600 pl-8">
              A refined ride-sharing ecosystem. Merging elite service, innovative tech, and absolute safety for the modern commuter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/login" className="group w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-[2.5rem] text-sm font-black transition-all shadow-2xl shadow-slate-300 hover:shadow-indigo-200 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-3 relative overflow-hidden">
              <span className="relative z-10">Begin Mission</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <Link href="/captain-login" className="group w-full sm:w-auto bg-white backdrop-blur-md text-slate-900 px-10 py-5 rounded-[2.5rem] text-sm font-black transition-all hover:bg-slate-50 uppercase tracking-widest border border-slate-200 shadow-xl shadow-black/5 flex items-center justify-center gap-3">
              Captain Entrance
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid (Floating White) */}
        <div className="hidden lg:grid absolute right-24 bottom-24 grid-cols-2 gap-4 max-w-lg z-20">
          {[
            {
              icon: Shield,
              title: "Verified Nodes",
              desc: "Multi-layered security & elite captains.",
              col: "text-indigo-600",
              border: "border-slate-100"
            },
            {
              icon: Clock,
              title: "Zero Latency",
              desc: "Instant dispatch protocol for members.",
              col: "text-indigo-500",
              border: "border-slate-100"
            }
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (i * 0.2) }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-white p-8 rounded-[3rem] border ${feat.border} shadow-2xl shadow-indigo-100/30 hover:shadow-indigo-200/50 transition-all group cursor-default`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100 group-hover:bg-indigo-600 transition-colors">
                <feat.icon className={`w-6 h-6 ${feat.col} group-hover:text-white transition-colors`} />
              </div>
              <h3 className="text-slate-900 font-black italic tracking-tighter text-2xl mb-1">{feat.title}</h3>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-loose">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer info */}
        <div className="absolute bottom-10 left-10 md:left-24 text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] z-10 group cursor-default">
          <p>© 2026 <span className="text-indigo-600">YatraRide</span> Integrated Systems. Secure Encryption Active.</p>
        </div>
      </div>
    </div>
  );
}
