import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaSpinner, FaUsers, FaPaw, FaUserPlus, FaClipboardList, FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import '../Designe/AdminHome.css';

const AdminHome = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [Requests, setRequests] = useState([]);
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
        fetchRequests();
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

const fetchPendingRequests = async () => {
    try {
        const response = await fetch('http://localhost:3000/pending-adoptions', {
            credentials: 'include',
        });
        const data = await response.json();
        setPendingRequests(data);
        setLoading(false);
    } catch (err) {
        console.error('Failed to fetch pending adoption requests:', err);
        setError('Failed to load pending requests');
        setLoading(false);
    }
};
// tarek
const fetchRequests = async () => {
    try {
        const response = await fetch('http://localhost:3000/request', {
            credentials: 'include',
        });
        const data = await response.json();
        setRequests(data);
        setLoading(false);
    } catch (err) {
        console.error('Failed to fetch pending adoption requests:', err);
        setError('Failed to load pending requests');
        setLoading(false);
    }
};
// alvee
const handleReviewRequest = async (requestId, action) => {
    setProcessingRequest(requestId);
    try {
        console.log('Request ID:', requestId);
        const response = await fetch(`http://localhost:3000/review-adoption/${requestId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
            credentials: 'include',
            body: JSON.stringify({
                status: action === 'approve' ? 'approved' : 'rejected',
            }),
            
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Request ${action}d successfully!`);
            // Update the list of pending requests
            setPendingRequests((prevState) =>
                prevState.filter((request) => request._id !== requestId)
            );
        } else {
            alert(data.message || 'Failed to review the request');
        }
    } catch (err) {
        console.error('Error reviewing the adoption request:', err);
        alert('An error occurred while reviewing the request');
    }
};


// tarek
const handleRequest = async (requestId, action) => {
    setProcessingRequest(requestId);
    try {
        console.log('Request ID:', requestId);
        const response = await fetch(`http://localhost:3000/request/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            
            credentials: 'include',
            body: JSON.stringify({
                status: action === 'approve' ? 'approved' : 'rejected',
            }),
            
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Request ${action}d successfully!`);
            // Update the list of pending requests
            setRequests((prevState) =>
                prevState.filter((request) => request._id !== requestId)
            );
        } else {
            alert(data.message || 'Failed to review the request');
        }
    } catch (err) {
        console.error('Error reviewing the adoption request:', err);
        alert('An error occurred while reviewing the request');
    }
}
   

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
                <div className="requests-section">
                    <div className="requests-header">
                        <h2 className="requests-title">Pending Adoption Requests</h2>
                        <span className="text-sm text-gray-500">
                            {pendingRequests.length} pending requests
                        </span>
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <FaCheck className="w-full h-full" />
                            </div>
                            <p className="empty-text">No pending adoption requests at the moment.</p>
                        </div>
                    ) : (
                        <div className="requests-grid">
                            {pendingRequests.map((request, index) => (
                                <div key={index} className="request-card">
                                    <div className="request-image-container">
                                        {request.petId && request.petId.image ? (
                                            <img
                                                src={request.petId.image}
                                                alt={request.petId.name || 'Pet image'}
                                                className="request-image"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center bg-gray-100 request-image">
                                                <span className="text-gray-400">No image available</span>
                                            </div>
                                        )}
                                        <div className="request-number">
                                            Request #{index + 1}
                                        </div>
                                    </div>

                                    <div className="request-content">
                                        <h3 className="request-title">
                                            {request.petId?.name || 'Unknown Pet'}
                                        </h3>
                                        <p className="request-breed">
                                            {request.petId?.breed || 'Breed not specified'}
                                        </p>
                                        <p className="request-description">
                                            {request.petId?.description || 'No description available'}
                                        </p>

                                        <div className="flex justify-around mt-4">
                                <button
                                    onClick={() => handleReviewRequest(request._id, 'approve')}
                                    className="px-4 py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-700"
                                >
                                    {/* {request._id} */}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReviewRequest(request._id, 'reject')}
                                    className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* adoption */}
                <div className="requests-section">
                    <div className="requests-header">
                        <h2 className="requests-title">Adoption Requests</h2>
                        <span className="text-sm text-gray-500">
                            {Requests.length} pending requests
                        </span>
                    </div>

                    {Requests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <FaCheck className="w-full h-full" />
                            </div>
                            <p className="empty-text">No pending adoption requests at the moment.</p>
                        </div>
                    ) : (
                        <div className="requests-grid">
                            {Requests.map((request, index) => (
                                <div key={index} className="request-card">
                                    <div className="request-image-container">
                                        {request.petId && request.petId.image ? (
                                            <img
                                                src={request.petId.image}
                                                alt={request.petId.name || 'Pet image'}
                                                className="request-image"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center bg-gray-100 request-image">
                                                <span className="text-gray-400">No image available</span>
                                            </div>
                                        )}
                                        <div className="request-number">
                                            Request #{index + 1}
                                        </div>
                                    </div>

                                    <div className="request-content">
                                        <h3 className="request-title">
                                            {request.petId?.name || 'Unknown Pet'}
                                        </h3>
                                        <p className="request-breed">
                                            {request.petId?.breed || 'Breed not specified'}
                                        </p>
                                        <p className="request-description">
                                            {request.petId?.description || 'No description available'}
                                        </p>

                                        <div className="flex justify-around mt-4">
                                <button
                                    onClick={() => handleRequest(request._id, 'approve')}
                                    className="px-4 py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-700"
                                >
                                    {/* {request._id} */}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReviewRequest(request._id, 'reject')}
                                    className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
