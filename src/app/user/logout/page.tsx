'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                const token = localStorage.getItem('token');
                await axios.get('/api/user/logout', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                localStorage.removeItem('token');
                router.push('/login');
            } catch (error) {
                console.error('Logout failed:', error);
                localStorage.removeItem('token');
                router.push('/login');
            }
        };

        logout();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Terminating Session...</h2>
            </div>
        </div>
    );
}
