import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';
import '../Desgine/user-home.css';

const UserHome = () => {
    const { user, userInfo } = useContext(AuthContext);
    const [petData, setPetData] = useState({ 
        totalPets: 0, 
        upcomingVaccinations: [], 
        upcomingAppointments: [] 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPetData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('http://localhost:3000/pets', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Please log in to view your pets');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Raw pet data:', data);

                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received from server');
                }

                const totalPets = data.length;

                // Process vaccinations
                const allVaccinations = data.flatMap(pet => {
                    if (!Array.isArray(pet.vaccinations)) {
                        console.log(`No vaccinations array for pet ${pet.name}`);
                        return [];
                    }
                    return pet.vaccinations.map(v => ({
                        ...v,
                        petName: pet.name,
                        date: new Date(v.date),
                        nextVaccinationDate: v.nextVaccinationDate ? new Date(v.nextVaccinationDate) : null
                    }));
                });

                const upcomingVaccinations = allVaccinations
                    .filter(v => {
                        const date = v.nextVaccinationDate || v.date;
                        return date && date >= new Date();
                    })
                    .sort((a, b) => {
                        const dateA = a.nextVaccinationDate || a.date;
                        const dateB = b.nextVaccinationDate || b.date;
                        return dateA - dateB;
                    });

                // Process appointments
                const allAppointments = data.flatMap(pet => {
                    if (!Array.isArray(pet.vetAppointments)) {
                        console.log(`No appointments array for pet ${pet.name}`);
                        return [];
                    }
                    return pet.vetAppointments.map(a => ({
                        ...a,
                        petName: pet.name,
                        dateOfAppointment: new Date(a.dateOfAppointment)
                    }));
                });

                const upcomingAppointments = allAppointments
                    .filter(a => a.dateOfAppointment && a.dateOfAppointment >= new Date())
                    .sort((a, b) => a.dateOfAppointment - b.dateOfAppointment);

                setPetData({
                    totalPets,
                    upcomingVaccinations,
                    upcomingAppointments,
                });
            } catch (error) {
                console.error('Error fetching pet data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 w-full flex justify-center items-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-blue-600 text-lg font-medium">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 w-full flex justify-center items-center">
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-md w-full text-center">
                    <div className="text-red-500 text-4xl mb-2">⚠️</div>
                    <div className="text-red-600 text-lg font-medium mb-1">Oops! Something went wrong</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 w-full">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Back User positioned top right */}
                <div className="flex justify-end mb-4">
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-lg transform transition-all duration-300 hover:scale-105">
                        <p className="text-blue-600 text-base font-bold flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                                {userInfo?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>Welcome Back, {userInfo?.name}!</span>
                        </p>
                    </div>
                </div>

                {/* Pet Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    {/* Pet Count Card */}
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-1">Total Pets</h3>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {petData.totalPets}
                                    </p>
                                </div>
                                <div className="text-3xl animate-bounce">🐾</div>
                            </div>
                        </div>
                    </div>

                    {/* Add Pet Profile Card */}
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105 relative overflow-hidden group lg:col-span-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h2 className="text-lg font-bold text-gray-800 mb-2">Add New Pet</h2>
                            <p className="text-gray-600 text-sm mb-3">
                                Because every journey begins with a story — start yours by sharing your pet's.
                            </p>
                            <button
                                onClick={() => navigate('/addpet')}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                            >
                                Add Pet
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Upcoming Vaccinations Card */}
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            Upcoming Vaccinations
                        </h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {petData.upcomingVaccinations.length > 0 ? (
                                petData.upcomingVaccinations.map((vaccination, index) => (
                                    <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-3 rounded-lg border border-blue-100 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-blue-800 text-sm mb-1">{vaccination.vaccineName}</h4>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-blue-600 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                        Pet: {vaccination.petName}
                                                    </p>
                                                    <p className="text-xs text-blue-600 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                        Date: {(vaccination.nextVaccinationDate || vaccination.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-blue-600 font-medium">Next: {(vaccination.nextVaccinationDate || vaccination.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {vaccination.notes && (
                                            <p className="mt-2 text-xs text-gray-600 bg-white/50 p-2 rounded">{vaccination.notes}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <div className="text-2xl mb-2">💉</div>
                                    <p className="text-gray-500 text-sm">No upcoming vaccinations scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Vet Appointments Card */}
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            Upcoming Vet Appointments
                        </h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {petData.upcomingAppointments.length > 0 ? (
                                petData.upcomingAppointments.map((appointment, index) => (
                                    <div key={index} className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-3 rounded-lg border border-purple-100 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-purple-800 text-sm mb-1">Dr. {appointment.doctorName}</h4>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-purple-600 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                                        Pet: {appointment.petName}
                                                    </p>
                                                    <p className="text-xs text-purple-600 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                                        Date: {appointment.dateOfAppointment.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {appointment.address && (
                                                <div className="text-right">
                                                    <p className="text-xs text-purple-600 font-medium">{appointment.address}</p>
                                                </div>
                                            )}
                                        </div>
                                        {appointment.notes && (
                                            <p className="mt-2 text-xs text-gray-600 bg-white/50 p-2 rounded">{appointment.notes}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <div className="text-2xl mb-2">🏥</div>
                                    <p className="text-gray-500 text-sm">No upcoming appointments scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
