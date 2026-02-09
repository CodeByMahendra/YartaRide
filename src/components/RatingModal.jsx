import React, { useState } from 'react';
import axios from 'axios';

const RatingModal = ({ ride, userType, onComplete }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/ratings/submit`, {
                rideId: ride._id,
                rating,
                comment
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onComplete();
        } catch (err) {
            console.error('Error submitting rating:', err);
            alert('Failed to submit rating. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-t-3xl p-6 shadow-2xl flex flex-col items-center">
            <h3 className="text-2xl font-black text-gray-900 mb-2">How was your trip?</h3>
            <p className="text-gray-500 text-sm mb-6 text-center">Your feedback helps us make the platform better for everyone.</p>

            {/* Star Rating */}
            <div className="flex gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-4xl transition-all ${star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-200'}`}
                    >
                        <i className={`ri-star-${star <= rating ? 'fill' : 'line'}`}></i>
                    </button>
                ))}
            </div>

            {/* Comment Box */}
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write an optional comment..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[100px] outline-none focus:border-black transition-all text-sm mb-8"
            />

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-black text-white font-black py-5 rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest disabled:bg-gray-400"
            >
                {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
        </div>
    );
};

export default RatingModal;
