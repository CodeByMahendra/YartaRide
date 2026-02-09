import React from 'react'

const ConfirmRide = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 md:hidden' onClick={() => {
                props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <h3 className='text-2xl font-bold mb-5 font-["Inter"]'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20 mix-blend-multiply' src={props.vehicleType === 'car' ? 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg' : props.vehicleType === 'moto' ? 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png' : 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png'} alt="Vehicle" />

                <div className='w-full mt-5 space-y-2'>
                    <div className='flex items-center gap-4 p-3 border-b border-gray-100'>
                        <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0'>
                            <i className="ri-map-pin-user-fill text-lg"></i>
                        </div>
                        <div className="overflow-hidden">
                            <h3 className='text-xs font-semibold uppercase text-gray-400'>Pickup</h3>
                            <p className='text-sm font-semibold text-gray-800 truncate'>{props.pickup}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-3 border-b border-gray-100'>
                        <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0'>
                            <i className="ri-map-pin-2-fill text-lg"></i>
                        </div>
                        <div className="overflow-hidden">
                            <h3 className='text-xs font-semibold uppercase text-gray-400'>Destination</h3>
                            <p className='text-sm font-semibold text-gray-800 truncate'>{props.destination}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-3'>
                        <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0'>
                            <i className="ri-currency-line text-lg"></i>
                        </div>
                        <div>
                            <div className='flex items-center gap-2'>
                                <h3 className='text-xs font-semibold uppercase text-gray-400'>Total Fare</h3>
                                {props.fare?.passUsed && (
                                    <span className='bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200'>PASS APPLIED</span>
                                )}
                            </div>
                            <h3 className='text-xl font-bold text-black'>₹{props.fare?.fares ? props.fare.fares[props.vehicleType] : 0}</h3>
                            <p className='text-xs text-gray-500'>{props.fare?.passUsed ? 'Free with Route Pass' : 'Payment via Cash'}</p>
                        </div>
                    </div>
                </div>

                <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.createRide()

                }} className='w-full mt-5 bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02]'>
                    Confirm Ride
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide