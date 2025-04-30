import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../../PetDetails.css"; // Importing the CSS file

const PetDetails = () => {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [walkedHours, setWalkedHours] = useState(0);
    const [walkedDistance, setWalkedDistance] = useState(0);
    const [showWalkingDataPopup, setShowWalkingDataPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/pets/${id}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setPet(data))
            .catch(err => console.error('Failed to fetch pet details:', err));
    }, [id]);

    useEffect(() => {
        if (pet) {
            setWalkedHours(0); // Reset walkedHours to 0 when the pet data changes
            setWalkedDistance(0); // Reset walkedDistance to 0 when the pet data changes
        }
    }, [pet]);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        if (months < 0) {
            years--;
            months += 12;
        }
        return years > 0 ? `${years} years ${months} months` : `${months} months`;
    };
//Naimur
    const handleLogWalkingData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/update-walking-data/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walkedHours, walkedDistance }),
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet.pet); 
                setShowWalkingDataPopup(false); 
            } else {
                alert('Failed to log walking data.');
            }
        } catch (error) {
            console.error('Error logging walking data:', error);
            alert('An error occurred while logging walking data.');
        }
    };

    const handleResetWalkingData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/reset-walking-data/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updatedPet = await response.json();
                alert('Walking data reset successfully!');
                setPet(updatedPet.pet); // Update the pet state with the reset data
                setShowWalkingDataPopup(false); // Close the popup
            } else {
                alert('Failed to reset walking data.');
            }
        } catch (error) {
            console.error('Error resetting walking data:', error);
            alert('An error occurred while resetting walking data.');
        }
    };

    if (!pet) return <p className="text-center text-red-500">Pet not found</p>;

    return (
       <div classname = "flex justify-center items-center w-screen"> <div className="pet-details-container">
            <div className="image-and-details">
                <div className="image-container">
                    <img src={pet.image} alt={pet.name} className="pet-image" />
                </div>
                <div className="details-container">
                    <h1 className="pet-name">{pet.name}</h1>
                    <p className="pet-breed">Breed: {pet.breed}</p>
                    <p className="pet-dob">Date of Birth: {new Date(pet.dob).toLocaleDateString()}</p>
                    <p className="pet-age">Age: {calculateAge(pet.dob)}</p>
                </div>
            </div>

            {/* Description Section */}
            <div className="pet-description">
                <p>{pet.description}</p>
            </div>

            {/* Vaccination and Vet Appointments Section */}
            <div className="side-by-side">
                {/* Vaccination Details Column */}
                <div className="scrollable-section">
                    <h2 className="column-title">Vaccination Details</h2>
                    {pet.vaccinations?.length > 0 ? (
                        pet.vaccinations.map((vaccine, index) => (
                            <div key={index} className="vaccination-card">
                                <p><strong>Vaccine Name:</strong> {vaccine.vaccineName}</p>
                                <p><strong>Vaccination Date:</strong> {new Date(vaccine.date).toLocaleDateString()}</p>
                                <p><strong>Next Vaccination Date:</strong> {new Date(vaccine.nextVaccinationDate).toLocaleDateString()}</p>
                                <p><strong>Notes:</strong> {vaccine.notes || 'No notes available'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No vaccination details available</p> 
                    )}
                </div>

                {/* Vet Appointments Column */}
                <div className="scrollable-section">
                    <h2 className="column-title">Vet Appointments</h2>
                    {pet.vetAppointments?.length > 0 ? (
                        pet.vetAppointments.map((appointment, index) => (
                            <div key={index} className="appointment-card">
                                <p><strong>Doctor's Name:</strong> {appointment.doctorName}</p>
                                <p><strong>Location:</strong> {appointment.address}</p>
                                <p><strong>Date of Appointment:</strong> {new Date(appointment.dateOfAppointment).toLocaleDateString()}</p>
                                <p><strong>Notes:</strong> {appointment.notes || 'No notes available'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No appointments available</p>
                    )}
                </div>
            </div>

            {/* Walking Data Section-Naimur */}
            <div className="walking-data-container">
                <p>Total Walked Hours: {pet.totalWalkedHours || 0}</p>
                <p>Total Distance Walked: {pet.totalWalkedDistance || 0} km</p>
                <p>Average Walked Hours: {(pet.avgWalkedHours || 0).toFixed(2)}</p>
                <p>Average Distance: {(pet.avgWalkedDistance || 0).toFixed(2)} km</p>
            </div>

            {/* Edit Button */}
            <div className="fab-container" style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                <button
                    onClick={() => setShowWalkingDataPopup(true)}
                    className="edit-button">
                    Edit
                </button>
            </div>

            {/* Walking Data Popup-Rupom */}
            {showWalkingDataPopup && (
                <div className="walking-data-popup">
                    <div className="popup-content">
                        <h2>Edit Walking Data</h2>
                        <div className="input-group">
                            <label htmlFor="walked-hours" className="input-label">
                                Hours Walked:
                            </label>
                            <input
                                type="number"
                                id="walked-hours"
                                placeholder="Enter Hours Walked"
                                className="input-field"
                                value={walkedHours}
                                onChange={(e) => setWalkedHours(Number(e.target.value))}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="walked-distance" className="input-label">
                                Distance (km):
                            </label>
                            <input
                                type="number"
                                id="walked-distance"
                                placeholder="Enter Distance (km)"
                                className="input-field"
                                value={walkedDistance}
                                onChange={(e) => setWalkedDistance(Number(e.target.value))}
                            />
                        </div>

                        <button
                            onClick={handleLogWalkingData}
                            className="save-button py-2 px-4 text-center text-white bg-green-500 rounded-lg hover:bg-green-700 transition duration-300 hover:scale-105 w-full font-semibold text-sm"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setShowWalkingDataPopup(false)}
                            className="cancel-button py-2 px-4 text-center text-white bg-red-500 rounded-lg hover:bg-red-700 transition duration-300 hover:scale-105 w-full font-semibold text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleResetWalkingData}
                            className="reset-button py-2 px-4 text-center text-white bg-yellow-500 rounded-lg hover:bg-yellow-700 transition duration-300 hover:scale-105 w-full font-semibold text-sm"
                        >
                            Reset Data
                        </button>
                    </div>
                </div>
            )}

            {/* Buttons for Edit and Remove Pet */}
            <div className="action-buttons-container mt-4">
                {/* Edit Profile Button */}
                <div className="edit-profile-button">
                    <button
                        onClick={() => navigate(`/edit-pet/${id}`)}
                        className="py-2 px-4 text-center text-white bg-[#3B82F6] rounded-lg hover:bg-[#2563EB] transition duration-300 hover:scale-105 w-full font-semibold text-sm"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Remove Pet Button */}
                <div className="remove-pet-button">
                    <button
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to remove this pet?')) {
                                try {
                                    const response = await fetch(`http://localhost:3000/delete-pet/${id}`, {
                                        method: 'DELETE',
                                        credentials: 'include',
                                    });

                                    if (response.ok) {
                                        alert('Pet removed successfully.');
                                        navigate('/pets'); // Redirect to the pets page
                                    } else {
                                        alert('Failed to remove pet.');
                                    }
                                } catch (error) {
                                    console.error('Error removing pet:', error);
                                    alert('An error occurred while removing the pet.');
                                }
                            }
                        }}
                        className="py-2 px-4 text-center text-white bg-red-500 rounded-lg hover:bg-red-700 transition duration-300 hover:scale-105 w-full font-semibold text-sm"
                    >
                        Remove Pet
                    </button>
                </div>
            </div>
        </div></div>
    );
};

export default PetDetails;
