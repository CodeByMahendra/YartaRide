import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: props.ride?._id,
                    otp: otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: props.ride } })
            }
        } catch (error) {
            console.error('Error starting ride:', error)
            alert(error.response?.data?.message || 'Failed to start ride. Please check the OTP and try again.')
        }
    }

    return (
        <div className="bg-white h-screen rounded-t-3xl p-4">
            <h5 className='p-2 text-center w-full absolute top-0' onClick={() => {
                props.setConfirmRidePopupPanel(false)
            }}><i className="text-3xl text-gray-300 ri-subtract-line"></i></h5>

            <h3 className='text-2xl font-black mb-6 text-gray-900 text-center mt-4'>START TRIP</h3>

            <div className='bg-gray-900 rounded-3xl p-6 mb-8 text-white shadow-2xl'>
                <div className='flex items-center gap-4 mb-6 pb-6 border-b border-gray-800'>
                    <img className='h-16 w-16 rounded-3xl object-cover border-2 border-yellow-400' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="User" />
                    <div>
                        <h2 className='text-xl font-bold capitalize'>{props.ride?.user?.fullname?.firstname || 'Rider'}</h2>
                        <p className='text-xs font-bold text-yellow-400 tracking-widest uppercase'>Confirmed Rider</p>
                    </div>
                </div>

                <div className='space-y-6'>
                    <div className='flex items-start gap-4'>
                        <i className="ri-map-pin-user-fill text-yellow-400 mt-1"></i>
                        <div>
                            <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Pickup Location</p>
                            <h3 className='text-sm font-bold leading-tight mt-1'>{props.ride?.pickup}</h3>
                        </div>
                    </div>
                    <div className='flex items-start gap-4'>
                        <i className="ri-map-pin-2-fill text-green-400 mt-1"></i>
                        <div>
                            <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Destination</p>
                            <h3 className='text-sm font-bold leading-tight mt-1'>{props.ride?.destination}</h3>
                        </div>
                    </div>
                    <div className='flex items-center justify-between pt-4 border-t border-gray-800'>
                        <div className='flex items-center gap-3'>
                            <i className="ri-bank-card-fill text-gray-400"></i>
                            <span className="text-sm font-bold text-gray-300">Amount Due</span>
                        </div>
                        <h3 className='text-2xl font-black text-white'>₹{props.ride?.fare}</h3>
                    </div>
                </div>
            </div>

            <div className='px-2'>
                <form onSubmit={submitHander}>
                    <p className='text-center text-xs font-black text-gray-400 uppercase tracking-widest mb-3'>ENTER RIDER'S OTP</p>
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="text"
                        maxLength="4"
                        className='bg-gray-100 px-6 py-5 font-mono text-3xl font-black rounded-2xl w-full text-center tracking-[0.5em] focus:bg-gray-200 outline-none transition-all placeholder:tracking-normal placeholder:text-lg placeholder:font-bold'
                        placeholder='_ _ _ _'
                    />

                    <div className="flex flex-col gap-3 mt-8">
                        <button className='w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 text-lg uppercase tracking-wider'>
                            START TRIP
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                props.setConfirmRidePopupPanel(false)
                            }}
                            className='w-full text-red-500 font-bold py-3 text-sm hover:underline uppercase tracking-widest'>
                            CANCEL & GO BACK
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp