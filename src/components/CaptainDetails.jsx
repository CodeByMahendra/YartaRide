
import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)

    return (
        <div className="bg-white rounded-t-3xl shadow-xl p-2">
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center justify-start gap-4'>
                    <img className='h-12 w-12 rounded-full object-cover border-2 border-yellow-400' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <div>
                        <h4 className='text-lg font-bold capitalize text-gray-800 leading-none'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                        <p className='text-xs text-green-600 font-medium mt-1'>Online & Active</p>
                    </div>
                </div>
                <div className="text-right">
                    <h4 className='text-2xl font-black text-gray-900'>₹0.00</h4>
                    <p className='text-[10px] font-bold text-gray-500 uppercase tracking-wider'>Today's Earnings</p>
                </div>
            </div>

            <div className='grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl'>
                <div className='flex flex-col items-center border-r border-gray-200 last:border-0'>
                    <i className="text-2xl mb-1 text-gray-400 ri-time-line"></i>
                    <h5 className='text-sm font-bold text-gray-800'>0.0</h5>
                    <p className='text-[10px] text-gray-500 font-medium'>Hours</p>
                </div>
                <div className='flex flex-col items-center border-r border-gray-200 last:border-0'>
                    <i className="text-2xl mb-1 text-gray-400 ri-speed-up-line"></i>
                    <h5 className='text-sm font-bold text-gray-800'>0.0</h5>
                    <p className='text-[10px] text-gray-500 font-medium'>Speed</p>
                </div>
                <div className='flex flex-col items-center'>
                    <i className="text-2xl mb-1 text-gray-400 ri-book-line"></i>
                    <h5 className='text-sm font-bold text-gray-800'>0.0</h5>
                    <p className='text-[10px] text-gray-500 font-medium'>Trips</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails