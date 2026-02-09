import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0 md:hidden' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <h3 className='text-2xl font-bold mb-5 font-["Inter"]'>Choose a YatraRide</h3>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
            }} className='flex border border-gray-200 hover:border-black transition-all cursor-pointer hover:shadow-md hover:bg-gray-50 mb-3 rounded-xl w-full p-3 items-center justify-between group'>
                <img className='h-12 md:h-14 mix-blend-multiply' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Car" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-bold text-base md:text-lg font-["Inter"]'>YatraRide Go <span className='text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1'><i className="ri-user-3-fill"></i> 4</span></h4>
                    <h5 className='font-medium text-sm text-green-600 mt-0.5'>{props.fare?.duration?.text || 'Finding...'} ({props.fare?.distance?.text})</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable, compact rides</p>
                </div>
                <h2 className='text-xl font-bold'>₹{props.fare?.fares?.car || 0}</h2>
            </div>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex border border-gray-200 hover:border-black transition-all cursor-pointer hover:shadow-md hover:bg-gray-50 mb-3 rounded-xl w-full p-3 items-center justify-between group'>
                <img className='h-12 md:h-14 mix-blend-multiply' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Moto" />
                <div className='-ml-2 w-1/2'>
                    <h4 className='font-bold text-base md:text-lg font-["Inter"]'>Moto <span className='text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1'><i className="ri-user-3-fill"></i> 1</span></h4>
                    <h5 className='font-medium text-sm text-green-600 mt-0.5'>{props.fare?.duration?.text || 'Finding...'} ({props.fare?.distance?.text})</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable motorcycle rides</p>
                </div>
                <h2 className='text-xl font-bold'>₹{props.fare?.fares?.moto || 0}</h2>
            </div>

            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex border border-gray-200 hover:border-black transition-all cursor-pointer hover:shadow-md hover:bg-gray-50 mb-3 rounded-xl w-full p-3 items-center justify-between group'>
                <img className='h-12 md:h-14 mix-blend-multiply' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="Auto" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-bold text-base md:text-lg font-["Inter"]'>YatraRide Auto <span className='text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1'><i className="ri-user-3-fill"></i> 3</span></h4>
                    <h5 className='font-medium text-sm text-green-600 mt-0.5'>{props.fare?.duration?.text || 'Finding...'} ({props.fare?.distance?.text})</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable Auto rides</p>
                </div>
                <h2 className='text-xl font-bold'>₹{props.fare?.fares?.auto || 0}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel