'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Signup is now handled automatically through Phone OTP flow
// If user is new, they complete their profile after OTP verification
const UserSignup = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-bold text-sm">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default UserSignup;
