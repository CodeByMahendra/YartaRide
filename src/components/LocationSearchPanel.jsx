import React from 'react'
import axios from 'axios'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField, setPickupLocation, setDestinationLocation }) => {

    const handleSuggestionClick = async (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                    params: { address: suggestion },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                setPickupLocation([response.data.ltd, response.data.lng])
            } catch (error) {
                console.error('Error fetching pickup coordinates:', error)
            }
        } else if (activeField === 'destination') {
            setDestination(suggestion)
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
                    params: { address: suggestion },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                setDestinationLocation([response.data.ltd, response.data.lng])
            } catch (error) {
                console.error('Error fetching destination coordinates:', error)
            }
        }
    }

    return (
        <div className="py-4">
            {/* Display fetched suggestions */}
            {
                suggestions.map((elem, idx) => (
                    <div key={idx} onClick={() => handleSuggestionClick(elem)} className='flex gap-4 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors items-center justify-start rounded-xl'>
                        <div className='bg-gray-100 h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-gray-600'>
                            <i className="ri-map-pin-fill text-lg"></i>
                        </div>
                        <h4 className='font-medium text-sm md:text-base text-gray-800 line-clamp-2'>{elem}</h4>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel