import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaSpinner, FaUsers, FaPaw, FaUserPlus, FaClipboardList, FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import '../Designe/AdminHome.css';

const AdminHome = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingRequest, setProcessingRequest] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPets: 0,
        newUsers24h: 0,
        totalAdoptionRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        adoptionRate: 0,
        userGrowth: 0
    });

    useEffect(() => {
        fetchStats();
        fetchPendingRequests();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/metrics', {
                credentials: 'include',
            });
            const data = await response.json();
            
            // Calculate additional metrics
            const adoptionRate = data.totalAdoptionRequests > 0 
                ? ((data.approvedRequests / data.totalAdoptionRequests) * 100).toFixed(1)
                : 0;
            
            setStats({
                ...data,
                adoptionRate,
                userGrowth: data.newUsers24h > 0 ? ((data.newUsers24h / data.totalUsers) * 100).toFixed(1) : 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };
// alvee start
   

    if (loading) {
        return <div className="text-center text-gray-600">Loading pending adoption requests...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                {/* Welcome Section */}
                <div className="flex justify-end mb-4">
                    <div className="p-3 transition-all duration-300 transform shadow-lg bg-white/80 backdrop-blur-md rounded-xl hover:scale-105">
                        <div className="flex items-center gap-2 text-base font-bold text-blue-600">
                            <div className="flex items-center justify-center w-8 h-8 text-sm text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                A
                            </div>
                            <span>Admin Dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-change positive">
                            <FaUserPlus className="mr-1" />
                            +{stats.newUsers24h} in 24h
                        </div>
                    </div>
                    <div className="stat-card positive">
                        <div className="stat-title">Total Pets</div>
                        <div className="stat-value">{stats.totalPets}</div>
                        <div className="stat-change">
                            <FaPaw className="mr-1" />
                            Available for adoption
                        </div>
                    </div>
                    <div className="stat-card warning">
                        <div className="stat-title">Adoption Requests</div>
                        <div className="stat-value">{stats.totalAdoptionRequests}</div>
                        <div className="stat-change">
                            <FaClipboardList className="mr-1" />
                            {stats.adoptionRate}% approval rate
                        </div>
                    </div>
                    <div className="stat-card positive">
                        <div className="stat-title">Approved Requests</div>
                        <div className="stat-value">{stats.approvedRequests}</div>
                        <div className="stat-change positive">
                            <FaCheckCircle className="mr-1" />
                            Successful adoptions
                        </div>
                    </div>
                    <div className="stat-card negative">
                        <div className="stat-title">Rejected Requests</div>
                        <div className="stat-value">{stats.rejectedRequests}</div>
                        <div className="stat-change negative">
                            <FaTimesCircle className="mr-1" />
                            Declined applications
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">User Growth</div>
                        <div className="stat-value">{stats.userGrowth}%</div>
                        <div className="stat-change positive">
                            <FaChartLine className="mr-1" />
                            Last 24 hours
                        </div>
                    </div>
                </div>

                {/*alvee start Pending Requests Section */}
               
            </div>
        </div>
    );
};

export default AdminHome;
