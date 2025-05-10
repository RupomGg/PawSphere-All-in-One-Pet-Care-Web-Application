import React, { useEffect, useState } from 'react';

const AdminHome = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch pending adoption requests
    useEffect(() => {
        fetch('http://localhost:3000/pending-adoptions', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                setPendingRequests(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch pending adoption requests:', err);
                setLoading(false);
            });
    }, []);
    // console.log('Pending Requests:', pendingRequests);
    

    // Handle the approval or rejection of adoption requests
    const handleReviewRequest = async (requestId, action) => {
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

    if (loading) {
        return <div className="text-center text-gray-600">Loading pending adoption requests...</div>;
    }

    return (
        <div className="p-8 rounded-lg shadow-md bg-gray-50">
            <h2 className="mb-6 text-2xl font-bold">Pending Adoption Requests</h2>

            {pendingRequests.length === 0 ? (
                <p className="text-center text-gray-500">No pending adoption requests at the moment.</p>
            ) : (
        
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* { 'r',pendingRequests} */}
                    {pendingRequests.map((request, index) => (
                        <div key={index} className="p-6 transition-all bg-white rounded-lg shadow-lg hover:shadow-xl">
                            
                            
                            <img
                            
                                src={request.petId?.image}
                                alt={request.petId?.name}
                                className="object-cover w-full h-48 mb-4 rounded-lg"
                            />
                            <div className="text-center">
                                <h3 className="text-xl font-semibold">{request.petId?.name}</h3>
                                <p className="text-gray-600">{request.petId?.breed}</p>
                                <p className="mt-2 text-sm text-gray-500">{request.petId?.description}</p>
                            </div>
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminHome;
