import React, { useEffect, useState } from 'react';

const Adoption = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/available-adoptions', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setPets(data))
            .catch(err => console.error('Failed to load pets for adoption:', err));
    }, []);
console.log(pets,14);

    return (
        <div className="p-6 mx-auto adoption-list max-w-7xl">
            <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-800">Pets Available for Adoption</h2>
            {pets.length === 0 ? (
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
                            <p className="mt-2 text-sm text-gray-500">{pet?.description}</p>
                            <div className="p-4 mt-4 rounded-lg bg-gray-50">
                                <h4 className="font-semibold text-gray-700">Contact Information</h4>
                                <p className="text-sm text-gray-600">Owner: {pet?.owner?.name}</p>
                                <p className="text-sm text-gray-600">Email: {pet?.owner?.email}</p>
                                {pet?.owner?.phone && (
                                    <p className="text-sm text-gray-600">Phone: {pet?.owner?.phone}</p>
                                )}
                                 {/* Owner Information-new change by rupom  */}
                            </div>
                            <div>
                            {/* <button className="absolute px-6 py-2 text-lg font-semibold text-white transition-colors duration-300 transform -translate-x-1/2 bg-indigo-600 rounded-full bottom-4 left-1/2 hover:bg-indigo-700 m">
                                Adopt
                            </button> */}
                            </div>
                           
                        </div>
                        
                    ))}
                    
                </div>
            )}
        </div>
    );
};

export default Adoption;
