import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Desgine/PetCard.css';

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
                fetchLostPets();
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
        <div className="p-6 mx-auto adoption-list max-w-7xl">
            <h2 className="mb-8 text-3xl font-extrabold text-center text-red-600">Lost Pets</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lostPets.map((report) => {
                    const { _id, petId, requestedBy, requestedAt, reviewedAt, status } = report;

                    return (
                        <div key={_id} className="pet-card">
                            <div className="pet-card-image-container">
                                <img
                                    src={petId.image}
                                    alt={petId.name}
                                    className="pet-card-image"
                                />
                            </div>
                            <div className="pet-card-content">
                                <h2 className="pet-card-title">{petId.name}</h2>
                                <p className="pet-card-description">{petId.description}</p>
                                <div className="pet-card-details">
                                    <p className="pet-card-detail">
                                        🐾 <span>Breed:</span> {petId.breed}
                                    </p>
                                    <p className="pet-card-detail">
                                        📅 <span>Reported on:</span> {new Date(requestedAt).toLocaleDateString()}
                                    </p>
                                    <p className="pet-card-detail">
                                        👤 <span>Reported by:</span> {requestedBy.name}
                                    </p>
                                </div>

                                {status === 'lost' && (
                                    <button
                                        onClick={() => handleMarkAsFound(_id)}
                                        className="block w-full py-2 text-center text-white transition duration-300 bg-green-500 rounded pet-card-link hover:bg-green-600"
                                    >
                                        Mark as Found
                                    </button>
                                )}

                                {status === 'found' && (
                                    <div className="mt-2 font-semibold text-center text-green-500">
                                        Found on {new Date(reviewedAt).toLocaleDateString()}
                                    </div>
                                )}

                                {/* <Link
                                    to={`/pet/${petId._id}`}
                                    className="block mt-2 text-center pet-card-link"
                                >
                                    View Profile
                                </Link> */}
                            </div>
                        </div>
                    );
                })}
            </div>

            {lostPets.length === 0 && (
                <p className="mt-8 text-center text-gray-500">No lost pets reported</p>
            )}
        </div>
    );
};

export default LostOrFound;
