import React, { useContext, useState } from 'react';
import DashboardHome from './Admin/DashboardHome';
import QuestionList from './Admin/QuestionList';
import Logout from './logout';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const { user } = useContext(AuthContext);

    const [activePage, setActivePage] = useState<'dashboard' | 'questions'>(
        user?.role === 'admin' ? 'dashboard' : 'questions'
    );

    const handlePageChange = (page: 'dashboard' | 'questions') => {
        if (user?.role === 'admin' || page === 'questions') {
            setActivePage(page);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <nav className="w-64 bg-gray-900 text-white flex flex-col justify-between shadow-lg">
                <div>
                    <div className="p-6 text-3xl font-bold border-b border-gray-700">
                        {user?.role === "admin" ? "Admin Panel" : "Contributor Panel"}
                    </div>
                    <ul className="mt-4">
                        {user?.role === 'admin' && (
                            <li
                                onClick={() => handlePageChange('dashboard')}
                                className={`px-8 py-3 text-lg font-medium rounded-r-lg cursor-pointer transition-colors 
                                    ${activePage === 'dashboard'
                                        ? 'bg-gray-700 text-white'
                                        : 'hover:bg-gray-700 hover:text-white text-gray-300'
                                    }`}
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && handlePageChange('dashboard')}
                            >
                                Dashboard
                            </li>
                        )}
                        <li
                            onClick={() => handlePageChange('questions')}
                            className={`mt-1 px-8 py-3 text-lg font-medium rounded-r-lg cursor-pointer transition-colors 
                                ${activePage === 'questions'
                                    ? 'bg-gray-700 text-white'
                                    : 'hover:bg-gray-700 hover:text-white text-gray-300'
                                }`}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handlePageChange('questions')}
                        >
                            Questions
                        </li>
                    </ul>
                </div>

                <div className="mb-6 px-8">
                    <Logout />
                </div>
            </nav>

            <main className="flex-1 p-8 overflow-auto">
                {activePage === 'dashboard' && user?.role === 'admin' && <DashboardHome />}
                {activePage === 'questions' && <QuestionList />}
            </main>
        </div>
    );
};

export default AdminDashboard;
