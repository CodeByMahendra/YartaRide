import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: 'ri-dashboard-line', path: '/admin/dashboard' },
        { name: 'Users', icon: 'ri-user-line', path: '/admin/users' },
        { name: 'Captains', icon: 'ri-steering-fill', path: '/admin/captains' },
        { name: 'Rides', icon: 'ri-riding-line', path: '/admin/rides' },
        { name: 'Payments', icon: 'ri-money-dollar-circle-line', path: '/admin/payments' },
        { name: 'Settings', icon: 'ri-settings-4-line', path: '/admin/settings' },
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 flex items-center space-x-3">
                <img className="w-12" src="/images/logo.png" alt="Logo" />
                <span className="text-xl font-bold text-gray-800 tracking-tight">YatraRide</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Home</div>
                {menuItems.slice(0, 1).map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.path
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <i className={`${item.icon} mr-3 text-lg`}></i>
                        {item.name}
                    </Link>
                ))}

                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-2">Members</div>
                {menuItems.slice(1, 3).map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.path
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <i className={`${item.icon} mr-3 text-lg`}></i>
                        {item.name}
                    </Link>
                ))}

                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-2">Services</div>
                {menuItems.slice(3).map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.path
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <i className={`${item.icon} mr-3 text-lg`}></i>
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <Link
                    to="/admin/logout"
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <i className="ri-logout-box-line mr-3 text-lg"></i>
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
