import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

// ⚠️ IMPORTANT: Replace these with your actual Firebase project config
// Get these from: Firebase Console → Project Settings → General → Your Apps → Web App
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase (prevent re-initialization in dev hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Setup invisible reCAPTCHA verifier
export const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
    const verifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
            // reCAPTCHA solved - will proceed with phone auth
        },
        'expired-callback': () => {
            // reCAPTCHA expired - reset
            console.log('reCAPTCHA expired. Please try again.');
        }
    });
    return verifier;
};

// Send OTP to phone number
export const sendOtp = async (
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
    // Ensure phone number has country code
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier);
    return confirmationResult;
};

// Verify OTP and get Firebase ID token
export const verifyOtp = async (
    confirmationResult: ConfirmationResult,
    otp: string
): Promise<string> => {
    const result = await confirmationResult.confirm(otp);
    const idToken = await result.user.getIdToken();
    return idToken;
};

export { auth, app };
