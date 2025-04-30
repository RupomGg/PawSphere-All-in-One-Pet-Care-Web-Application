import React, { useEffect, useState } from 'react';
import PetCard from './PetCard';
import bgImage from '../../assets/bg.jpg';

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/pets', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    console.log('Fetched pets data:', data); // Debugging log
                    setPets(data);
                } else {
                    console.warn('Not an array:', data);
                    setPets([]);
                }
            })
            .catch(err => {
                console.error('Error fetching pets:', err);
                setPets([]);
            });
    }, []);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSortChange = (e) => {
        const [key, order] = e.target.value.split('-');
        setSortOption(e.target.value);
        let sortedPets = [...pets];
        if (key === 'name') {
            sortedPets.sort((a, b) => {
                return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            });
        } else if (key === 'age') {
            sortedPets.sort((a, b) => {
                return order === 'asc' ? calculateAge(a.dob) - calculateAge(b.dob) : calculateAge(b.dob) - calculateAge(a.dob);
            });
        }
        setPets(sortedPets);
    };

    return (
        <div className="px-6 py-12 min-h-screen" style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            {/* Top Section: Pet Count and Sorting Dropdown */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 text-white">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-wide text-blue-600 mb-4 sm:mb-0">
                    Your Pets ({pets.length})
                </h2>

                <div className="text-right w-full sm:w-auto">
                    <label htmlFor="sort" className="mr-3 text-lg font-medium">Sort by:</label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={handleSortChange}
                        className="px-6 py-3 border rounded-lg shadow-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent backdrop-blur-sm text-blue-600 w-full sm:w-auto"
                    >
                        <option value="">Sort-By</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="age-asc">Age (Asc)</option>
                        <option value="age-desc">Age (Desc)</option>
                    </select>
                </div>
            </div>

            {/* Pet Cards Grid */}
            {pets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pets.map((pet) => (
                        <div key={pet._id} className="h-full flex">
                            <PetCard pet={pet} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-10 text-lg text-center text-red-500">
                    No pets to display or you're not authorized.
                </p>
            )}
        </div>
    );
};

export default Pets;
