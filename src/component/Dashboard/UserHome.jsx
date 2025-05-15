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
            <div className="flex items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="text-lg font-medium text-blue-600">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="w-full max-w-md p-6 text-center shadow-xl bg-white/80 backdrop-blur-md rounded-xl">
                    <div className="mb-2 text-4xl text-red-500">⚠️</div>
                    <div className="mb-1 text-lg font-medium text-red-600">Oops! Something went wrong</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="mx-auto max-w-7xl">
                {/* Welcome Back User positioned top right */}
                <div className="flex justify-end mb-4">
                    <div className="p-3 transition-all duration-300 transform shadow-lg bg-white/80 backdrop-blur-md rounded-xl hover:scale-105">
                        <p className="flex items-center gap-2 text-base font-bold text-blue-600">
                            <div className="flex items-center justify-center w-8 h-8 text-sm text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                {userInfo?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>Welcome Back, {userInfo?.name}!</span>
                        </p>
                    </div>
                </div>

                {/* Pet Dashboard */}
                <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-3">
                    {/* Pet Count Card */}
                    <div className="relative p-4 overflow-hidden transition-all duration-300 transform shadow-lg bg-white/80 backdrop-blur-md rounded-xl hover:scale-105 group">
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="mb-1 text-base font-semibold text-gray-800">Total Pets</h3>
                                    <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                                        {petData.totalPets}
                                    </p>
                                </div>
                                <div className="text-3xl animate-bounce">🐾</div>
                            </div>
                        </div>
                    </div>

                    {/* Add Pet Profile Card */}
                    <div className="relative p-4 overflow-hidden transition-all duration-300 transform shadow-lg bg-white/80 backdrop-blur-md rounded-xl hover:scale-105 group lg:col-span-2">
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 group-hover:opacity-100"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h2 className="mb-2 text-lg font-bold text-gray-800">Add New Pet</h2>
                            <p className="mb-3 text-sm text-gray-600">
                                Because every journey begins with a story — start yours by sharing your pet's.
                            </p>
                            <button
                                onClick={() => navigate('/addpet')}
                                className="px-6 py-2 font-semibold text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                            >
                                Add Pet
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
                    {/* Upcoming Vaccinations Card */}
                    <div className="p-4 shadow-lg bg-white/80 backdrop-blur-md rounded-xl">
                        <h3 className="flex items-center gap-2 mb-3 text-lg font-bold text-gray-800">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            Upcoming Vaccinations
                        </h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {petData.upcomingVaccinations.length > 0 ? (
                                petData.upcomingVaccinations.map((vaccination, index) => (
                                    <div key={index} className="p-3 transition-all duration-300 transform border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 hover:scale-105 hover:shadow-md">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="mb-1 text-sm font-semibold text-blue-800">{vaccination.vaccineName}</h4>
                                                <div className="space-y-0.5">
                                                    <p className="flex items-center gap-1 text-xs text-blue-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                        Pet: {vaccination.petName}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-xs text-blue-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                        Date: {(vaccination.nextVaccinationDate || vaccination.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-medium text-blue-600">Next: {(vaccination.nextVaccinationDate || vaccination.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {vaccination.notes && (
                                            <p className="p-2 mt-2 text-xs text-gray-600 rounded bg-white/50">{vaccination.notes}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-4 text-center">
                                    <div className="mb-2 text-2xl">💉</div>
                                    <p className="text-sm text-gray-500">No upcoming vaccinations scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Vet Appointments Card */}
                    <div className="p-4 shadow-lg bg-white/80 backdrop-blur-md rounded-xl">
                        <h3 className="flex items-center gap-2 mb-3 text-lg font-bold text-gray-800">
                            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            Upcoming Vet Appointments
                        </h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {petData.upcomingAppointments.length > 0 ? (
                                petData.upcomingAppointments.map((appointment, index) => (
                                    <div key={index} className="p-3 transition-all duration-300 transform border border-purple-100 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/50 hover:scale-105 hover:shadow-md">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="mb-1 text-sm font-semibold text-purple-800">Dr. {appointment.doctorName}</h4>
                                                <div className="space-y-0.5">
                                                    <p className="flex items-center gap-1 text-xs text-purple-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                                        Pet: {appointment.petName}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-xs text-purple-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                                        Date: {appointment.dateOfAppointment.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {appointment.address && (
                                                <div className="text-right">
                                                    <p className="text-xs font-medium text-purple-600">{appointment.address}</p>
                                                </div>
                                            )}
                                        </div>
                                        {appointment.notes && (
                                            <p className="p-2 mt-2 text-xs text-gray-600 rounded bg-white/50">{appointment.notes}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-4 text-center">
                                    <div className="mb-2 text-2xl">🏥</div>
                                    <p className="text-sm text-gray-500">No upcoming appointments scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews Button Section */}
                <div className="p-4 transition-all duration-300 transform shadow-lg bg-white/80 backdrop-blur-md rounded-xl hover:scale-105"> 
                    <div className="flex flex-col items-center text-center">
                        <h2 className="mb-2 text-lg font-bold text-gray-800">Pet Reviews</h2>
                        <p className="mb-3 text-sm text-gray-600">
                            Read and share experiences with other pet owners
                        </p>
                        <button
                            onClick={() => navigate('/reviews')}
                            className="px-6 py-2 font-semibold text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                        >
                            View Reviews
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
