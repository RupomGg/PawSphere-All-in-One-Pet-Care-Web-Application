import React, { useState, useEffect } from 'react';

const LostOrFound = () => {
    const [lostPets, setLostPets] = useState([]);

    useEffect(() => {
        fetchLostPets();
    }, []);

    const fetchLostPets = async () => {
        try {
            const response = await fetch('http://localhost:3000/lost-pets', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setLostPets(data);
            }
        } catch (error) {
            console.error('Error fetching lost pets:', error);
        }
    };

    const handleMarkAsFound = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:3000/mark-found/${reportId}`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                alert('Pet marked as found successfully!');
                fetchLostPets(); // Refresh the list
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to mark pet as found');
            }
        } catch (error) {
            console.error('Error marking pet as found:', error);
            alert('Failed to mark pet as found');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Lost Pets</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostPets.map((report) => (
                    <div key={report._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <img 
                            src={report.petId.image} 
                            alt={report.petId.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{report.petId.name}</h2>
                            <p className="text-gray-600 mb-2">Breed: {report.petId.breed}</p>
                            <p className="text-gray-600 mb-2">Description: {report.petId.description}</p>
                            <p className="text-gray-600 mb-2">
                                Reported by: {report.requestedBy.name}
                            </p>
                            <p className="text-gray-600 mb-4">
                                Reported on: {new Date(report.requestedAt).toLocaleDateString()}
                            </p>
                            {report.status === 'lost' && (
                                <button
                                    onClick={() => handleMarkAsFound(report._id)}
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                                >
                                    Mark as Found
                                </button>
                            )}
                            {report.status === 'found' && (
                                <div className="text-green-500 font-semibold text-center">
                                    Found on {new Date(report.reviewedAt).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {lostPets.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No lost pets reported</p>
            )}
        </div>
    );
};

export default LostOrFound;