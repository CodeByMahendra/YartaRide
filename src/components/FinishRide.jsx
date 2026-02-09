import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const FinishRide = (props) => {

    const navigate = useNavigate()

    async function endRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
                rideId: props.ride._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                if (props.onRideFinished) {
                    props.onRideFinished();
                } else {
                    navigate('/captain-home')
                }
            }
        } catch (error) {
            console.error('Error ending ride:', error)
            alert(error.response?.data?.message || 'Failed to end ride. Please try again.')
        }
    }

    return (
        <div className="bg-white rounded-t-3xl">
            <h5 className='p-2 text-center w-full absolute top-0' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-300 ri-subtract-line"></i></h5>

            <h3 className='text-2xl font-black mb-6 text-gray-900 text-center mt-4'>TRIP SUMMARY</h3>

            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-6'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 w-12 rounded-full border-2 border-yellow-400 object-cover shadow-sm' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="User" />
                    <div>
                        <h2 className='text-lg font-bold text-gray-900 capitalize'>{props.ride?.user.fullname.firstname}</h2>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Rider</p>
                    </div>
                </div>
                <div className="text-right">
                    <h5 className='text-xl font-black text-gray-900 italic'>₹{props.ride?.fare}</h5>
                    <p className='text-[10px] font-bold text-green-600 uppercase italic'>Paid via Cash</p>
                </div>
            </div>

            <div className='space-y-4 mb-8'>
                <div className='flex items-start gap-4 p-4'>
                    <div className="bg-black p-2 rounded-lg">
                        <i className="ri-map-pin-user-fill text-white text-base"></i>
                    </div>
                    <div>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>From</p>
                        <h3 className='text-sm font-bold text-gray-800 leading-tight mt-1'>{props.ride?.pickup}</h3>
                    </div>
                </div>

                <div className='flex items-start gap-4 p-4'>
                    <div className="bg-yellow-400 p-2 rounded-lg">
                        <i className="ri-map-pin-2-fill text-gray-900 text-base"></i>
                    </div>
                    <div>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>To</p>
                        <h3 className='text-sm font-bold text-gray-800 leading-tight mt-1'>{props.ride?.destination}</h3>
                    </div>
                </div>
            </div>

            <div className='px-4 pb-4'>
                <button
                    onClick={endRide}
                    className='w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 text-lg uppercase tracking-wider'>
                    FINISH RIDE
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">Please ensure you have received the cash payment before finishing.</p>
            </div>
        </div>
    )
}

export default FinishRide