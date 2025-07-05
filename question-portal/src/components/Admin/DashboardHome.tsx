import React, { useEffect, useState } from 'react';
import { getDashboard } from '../../services/authService';

interface AnalyticsData {
    totalQuestions: number;
    approvedCount: number;
    rejectionRate: number;
}

const DashboardHome: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetching analytics data
    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in again.');
                    setLoading(false);
                    return;
                }

                setLoading(true);
                setError(null); // Reset error before fetching
                const response = await getDashboard(token); // Fetch analytics data
                setData(response);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch analytics data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
                <span className="text-gray-500 text-xl">Loading...</span>
                {/* Optional: Add a spinner or loader */}
                {/* <div className="spinner">Loading...</div> */}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
                <span className="text-red-500 text-xl">Error: {error}</span>
                {/* Optional: Add a retry button */}
                {/* <button onClick={fetchAnalytics} className="btn btn-primary">Retry</button> */}
            </div>
        );
    }

    // Main content
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Total Questions */}
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
                    <span className="text-gray-500 uppercase text-sm tracking-wide mb-2">
                        Total Questions
                    </span>
                    <span className="text-4xl font-extrabold text-blue-600">
                        {data?.totalQuestions ?? '0'}
                    </span>
                </div>

                {/* Approvals */}
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
                    <span className="text-gray-500 uppercase text-sm tracking-wide mb-2">
                        Approvals
                    </span>
                    <span className="text-4xl font-extrabold text-green-600">
                        {data?.approvedCount ?? '0'}
                    </span>
                </div>

                {/* Rejection Rate */}
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
                    <span className="text-gray-500 uppercase text-sm tracking-wide mb-2">
                        Rejection Rate
                    </span>
                    <span className="text-4xl font-extrabold text-red-600">
                        {data ? `${data.rejectionRate.toFixed(1)}%` : '0%'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
