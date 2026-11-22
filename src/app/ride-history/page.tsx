'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ArrowLeft, Download, Calendar, Clock,
  Filter, Car, CheckCircle2, XCircle
} from 'lucide-react';
import Link from 'next/link';

const RideHistory = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const rides = [
    { id: "RD-9901", from: "Cyber City, GGN", to: "Sector 62, Noida", date: "05 Feb 2026, 02:30 PM", fare: "₹450", status: "Completed", captain: "Amit Singh", vehicle: "Yatra Car" },
    { id: "RD-9902", from: "Airport T3", to: "Malviya Nagar", date: "04 Feb 2026, 08:15 PM", fare: "₹380", status: "Completed", captain: "Vikram Das", vehicle: "Yatra Auto" },
    { id: "RD-9903", from: "Connaught Place", to: "Hauz Khas", date: "01 Feb 2026, 11:00 AM", fare: "₹0", status: "Cancelled", captain: "N/A", vehicle: "Yatra Bike" },
  ];

  const filteredRides = rides.filter(r => {
    if (filter === 'completed') return r.status === 'Completed';
    if (filter === 'cancelled') return r.status === 'Cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Ride History</h1>
              <p className="text-xs text-slate-500">Past trips & receipts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exporting trip receipts...')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* Quick Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-xs text-slate-500">Total Rides</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">18</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-xs text-slate-500">Distance</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">142 km</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-xs text-slate-500">Total Spent</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">₹3,420</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 pt-1">
          {(['all', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Ride List */}
        <div className="space-y-3">
          {filteredRides.map((ride, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={ride.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{ride.vehicle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>{ride.date}</span>
                      <span>•</span>
                      <span>ID: {ride.id}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{ride.fare}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-0.5 ${
                      ride.status === 'Completed' ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {ride.status === 'Completed' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {ride.status}
                  </span>
                </div>
              </div>

              {/* Pickup & Destination */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-slate-500 w-12 font-medium">Pickup:</span>
                  <span className="font-semibold text-slate-800 truncate">{ride.from}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 flex-shrink-0" />
                  <span className="text-slate-500 w-12 font-medium">Drop:</span>
                  <span className="font-semibold text-slate-800 truncate">{ride.to}</span>
                </div>
              </div>

              {/* Driver and action */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Driver: <strong className="text-slate-700 font-semibold">{ride.captain}</strong></span>
                <button
                  onClick={() => alert(`Receipt downloaded for ${ride.id}`)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Download Invoice
                </button>
              </div>
            </motion.div>
          ))}

          {filteredRides.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <p className="text-sm font-semibold">No rides found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideHistory;