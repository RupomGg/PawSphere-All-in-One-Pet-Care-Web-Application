





import React, { useEffect, useState } from 'react';

const Adoption = () => {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [ageSort, setAgeSort] = useState('none');
    const [loading, setLoading] = useState(false);

    // Function to calculate age from date of birth - added by naimur
    const calculateAge = (dob) => {
        if (!dob) return 'Age not available';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Added by naimur - fetch pets with search and age sorting
    const fetchPets = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search: searchTerm,
                ageFilter: ageSort
            });
            
            console.log('Fetching with params:', { searchTerm, ageSort });
            const response = await fetch(`http://localhost:3000/available-adoptions?${queryParams}`, {
                credentials: 'include'
            });
            const data = await response.json();
            console.log('Received data:', data);
            setPets(data);
        } catch (err) {
            console.error('Failed to load pets for adoption:', err);
        } finally {
            setLoading(false);
        }
    };

    // Added by naimur - initial fetch and debounced search
    useEffect(() => {
        console.log('Initial fetch');
        fetchPets();
    }, []);

    useEffect(() => {
        console.log('Search/Sort changed:', { searchTerm, ageSort });
        const timer = setTimeout(() => {
            fetchPets();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, ageSort]);

    return (
        <div className="p-6 mx-auto adoption-list max-w-7xl">
            <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-800">Pets Available for Adoption</h2>
            
            <div className="mb-8">
                <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md sm:flex-row">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by name or breed..."
                            className="w-full p-3 pl-10 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg 
                            className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <select
                        className="p-3 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={ageSort}
                        onChange={(e) => setAgeSort(e.target.value)}
                    >
                        <option value="none">Sort by Age</option>
                        <option value="youngest">Youngest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <p className="text-xl text-gray-600">Loading...</p>
                </div>
                // naimur end

                // alvee
            ) : pets.length === 0 ? (
                <p className="text-xl text-center text-gray-500">No pets available for adoption yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 " >
                    {pets.map((pet, index) => (
                        <div key={index} className="relative p-6 transition-transform transform border border-blue-500 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl pet-card">
                            <img
                                src={pet?.image}
                                alt={pet?.name}
                                className="object-cover w-full h-56 mb-4 rounded-lg"
                            />
                            <h3 className="text-xl font-semibold text-gray-800">{pet?.name}</h3>
                            <p className="text-gray-600">{pet?.breed}</p>
                            <p className="text-gray-600">Age: {calculateAge(pet?.dob)} years</p>
                            <p className="mt-2 text-sm text-gray-500">{pet?.description}</p>
                            <div className="p-4 mt-4 rounded-lg bg-gray-50">
                                <h4 className="font-semibold text-gray-700">Contact Information</h4>
                                <p className="text-sm text-gray-600">Owner: {pet?.owner?.name}</p>
                                <p className="text-sm text-gray-600">Email: {pet?.owner?.email}</p>
                                {pet?.owner?.phone && (
                                    <p className="text-sm text-gray-600">Phone: {pet?.owner?.phone}</p>
                                )}
                            </div>
                            {/* tarek part */}
                            <button 
                                className="btn btn-active btn-accent"
                                onClick={async () => {
                                    try {
                                        const res = await fetch(`http://localhost:3000/request/${pet._id}`, {
                                            method: 'POST',
                                            credentials: 'include',
                                        });
                                        const data = await res.json();
                                        alert(data.message);
                                        // Refresh pet data to update the adoption status
                                        fetch('http://localhost:3000/available-adoptions', {
                                            credentials: 'include'
                                        })
                                            .then(res => res.json())
                                            .then(data => setPets(data))
                                            .catch(err => console.error('Failed to refresh pets:', err));
                                    } catch (err) {
                                        console.error('Adoption request failed:', err);
                                        alert('Request failed: ' + (err.message || 'Unknown error'));
                                    }
                                }}
                            >
                                Adopt
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Adoption;

