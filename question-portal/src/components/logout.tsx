import React from 'react';

const Logout: React.FC = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-2 hover:text-white text-red-500 font-semibold"
        >
            Logout
        </button>
    );
};

export default Logout;
