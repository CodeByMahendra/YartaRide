'use client';
import React, { createContext, useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, X, Info, ShieldAlert } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'push';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    title?: string;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType, title?: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, title }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className="pointer-events-auto"
                        >
                            <div className={`relative overflow-hidden bg-white rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex items-start gap-4`}>
                                {/* Decorative dynamic background */}
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${toast.type === 'success' ? 'bg-emerald-500' :
                                        toast.type === 'error' ? 'bg-rose-500' :
                                            toast.type === 'push' ? 'bg-indigo-600' : 'bg-amber-500'
                                    }`}></div>

                                <div className={`p-3 rounded-2xl ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                        toast.type === 'error' ? 'bg-rose-50 text-rose-600' :
                                            toast.type === 'push' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {toast.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                                    {toast.type === 'error' && <AlertCircle className="w-6 h-6" />}
                                    {toast.type === 'push' && <Bell className="w-6 h-6 animate-swing" />}
                                    {(toast.type === 'info' || toast.type === 'warning') && <Info className="w-6 h-6" />}
                                </div>

                                <div className="flex-1 pr-4">
                                    <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">
                                        {toast.title || (toast.type === 'push' ? 'New Notification' : toast.type.toUpperCase())}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {toast.message}
                                    </p>
                                </div>

                                <button onClick={() => removeToast(toast.id)} className="text-slate-300 hover:text-slate-600 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
