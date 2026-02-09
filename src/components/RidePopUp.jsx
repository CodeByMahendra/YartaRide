import React from 'react'

const RidePopUp = (props) => {
    return (
        <div className="bg-white rounded-t-3xl">
            <h5 className='p-2 text-center w-full absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-300 ri-subtract-line"></i></h5>

            <h3 className='text-2xl font-bold mb-6 text-gray-800'>New Trip Available!</h3>

            <div className='flex items-center justify-between p-4 bg-yellow-400 rounded-2xl mb-6 shadow-md'>
                <div className='flex items-center gap-3 '>
                    <img className='h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="User" />
                    <div>
                        <h2 className='text-lg font-bold text-gray-900 capitalize'>{props.ride?.user?.fullname?.firstname + " " + (props.ride?.user?.fullname?.lastname || "")}</h2>
                        <p className='text-xs font-semibold text-gray-800 opacity-80'>New Request</p>
                    </div>
                </div>
                <div className="text-right">
                    <h5 className='text-xl font-black text-gray-900 italic'>₹{props.ride?.fare}</h5>
                    <p className='text-[10px] font-bold text-gray-800 uppercase'>{props.ride?.passUsed ? 'PASS RIDE' : 'Total Fare'}</p>
                </div>
            </div>

            <div className='space-y-4 mb-8'>
                <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-2xl'>
                    <div className="bg-black p-2 rounded-lg">
                        <i className="ri-map-pin-user-fill text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Pickup</p>
                        <h3 className='text-base font-bold text-gray-800 leading-tight mt-1'>{props.ride?.pickup}</h3>
                    </div>
                </div>

                <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-2xl'>
                    <div className="bg-yellow-400 p-2 rounded-lg">
                        <i className="ri-map-pin-2-fill text-gray-900 text-lg"></i>
                    </div>
                    <div className="flex-1">
                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Destination</p>
                        <h3 className='text-base font-bold text-gray-800 leading-tight mt-1'>{props.ride?.destination}</h3>
                    </div>
                </div>
            </div>

            <div className='flex gap-3'>
                <button onClick={() => {
                    props.setConfirmRidePopupPanel(true)
                    props.confirmRide()
                }} className='flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95'>
                    ACCEPT
                </button>

                <button onClick={() => {
                    props.setRidePopupPanel(false)
                }} className='px-8 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all'>
                    IGNORE
                </button>
            </div>
        </div>
    )
}

export default RidePopUp