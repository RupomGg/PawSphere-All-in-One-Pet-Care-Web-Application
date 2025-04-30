import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';
import '../Desgine/user-home.css'; 
const UserHome = () => {
    const { userInfo } = useContext(AuthContext);
    const [petData, setPetData] = useState({ totalPets: 0, nextVaccination: null, nextAppointment: null });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const response = await fetch(`/api/pets?owner=${userInfo?.id}`);
                if (!response.ok) {
                    console.error('Error fetching pet data:', response.status, response.statusText);
                    const errorText = await response.text();
                    console.error('Error response text:', errorText); // Log the full response for debugging
                    return;
                }
                const data = await response.json();
                console.log('Fetched pet data:', data);

                const totalPets = data.reduce((count, pet) => count + 1, 0);

                const upcomingVaccinations = data
                    .flatMap(pet => pet.vaccinations.map(v => ({ ...v, petName: pet.name })))
                    .filter(v => new Date(v.nextVaccinationDate) >= new Date())
                    .sort((a, b) => new Date(a.nextVaccinationDate) - new Date(b.nextVaccinationDate));

                const upcomingAppointments = data
                    .flatMap(pet => pet.vetAppointments.map(a => ({ ...a, petName: pet.name })))
                    .filter(a => new Date(a.dateOfAppointment) >= new Date())
                    .sort((a, b) => new Date(a.dateOfAppointment) - new Date(b.dateOfAppointment));

                setPetData({
                    totalPets,
                    nextVaccination: upcomingVaccinations[0] || null,
                    nextAppointment: upcomingAppointments[0] || null,
                });
            } catch (error) {
                console.error('Error fetching pet data:', error);
            }
        };

        fetchPetData();
    }, [userInfo]);

    return (
        <div className="user-home min-h-screen p-6 w-full flex justify-center items-center">
            <div className="relative z-10 w-full max-w-6xl">
                {/* Welcome Back User positioned top right */}
                <div className="absolute top-4 right-4">
                    <p className="text-blue-600 text-lg font-bold">Welcome Back, {userInfo?.name}!</p>
                </div>

                {/* Pet Dashboard */}
                <div className="pet-dashboard mb-6">
                    <h2 className="text-2xl font-semibold text-blue-600">Pet Dashboard</h2>
                    <p className="text-black">Total Pets: {petData.totalPets}</p>
                    {petData.nextVaccination && (
                        <p className="text-white">
                            Next Vaccination: {petData.nextVaccination.petName} - {petData.nextVaccination.vaccineName} on {new Date(petData.nextVaccination.nextVaccinationDate).toLocaleDateString()}
                        </p>
                    )}
                    {petData.nextAppointment && (
                        <p className="text-white">
                            Next Appointment: {petData.nextAppointment.petName} with {petData.nextAppointment.doctorName} on {new Date(petData.nextAppointment.dateOfAppointment).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Add Pet Profile container */}
                <div className="add-pet-profile flex flex-col items-center px-6 py-10 mb-12 text-center bg-white/20 backdrop-blur-md rounded-xl shadow-lg" style={{
                    width: '100%',
                    maxWidth: '500px',
                }}>
                    <h2 className="mb-4 text-3xl font-semibold text-black">Add Pet Profile</h2>
                    <p className="max-w-xl mb-6 text-black">
                        Because every journey begins with a story — start yours by sharing your pet's.
                    </p>
                    <button
                        onClick={() => navigate('/addpet')}
                        className="px-6 btn bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Add Pet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
