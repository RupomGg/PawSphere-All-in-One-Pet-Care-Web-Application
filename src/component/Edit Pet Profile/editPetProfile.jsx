import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Desgine/editPetProfile.css';

const EditPetProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState({
        name: '',
        breed: '',
        description: '',
        image: '',
        vaccinations: [],
        vetAppointments: []
    });
    const [newVaccination, setNewVaccination] = useState({
        vaccineName: '',
        date: '',
        notes: '',
        nextVaccinationDate: ''
    });
    const [newAppointment, setNewAppointment] = useState({
        doctorName: '',
        address: '',
        dateOfAppointment: ''
    });
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedVaccination, setSelectedVaccination] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/pets/${id}`)
            .then(res => res.json())
            .then(data => setPet(data))
            .catch(err => console.error('Error fetching pet details:', err));
    }, [id]);

    const toggleEditMenu = (type) => {
        setShowEditMenu(true);
        if (type === 'appointment') {
            // For appointments, show first appointment by default if exists
            const firstAppointment = pet.vetAppointments?.[0];
            setSelectedAppointment(firstAppointment || null);
            setSelectedVaccination(null);
        } else if (type === 'vaccination') {
            // For vaccinations, show first vaccination by default if exists
            const firstVaccination = pet.vaccinations?.[0];
            setSelectedVaccination(firstVaccination || null);
            setSelectedAppointment(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPet({ ...pet, [name]: value });
    };

    const handleVaccinationChange = (e) => {
        const { name, value } = e.target;
        setNewVaccination({ ...newVaccination, [name]: value });
    };

    const updatePetProfile = () => {
        fetch(`http://localhost:3000/update-pet/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...pet, vetAppointments: pet.vetAppointments || [] })
        })
            .then(res => res.json())
            .then(() => {
                toast.success('Pet profile updated');
                navigate(`/pet/${id}`);
            })
            .catch(err => console.error('Error updating pet profile:', err));
    };

    const addVaccination = () => {
        fetch(`http://localhost:3000/add-vaccination/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVaccination)
        })
            .then(res => res.json())
            .then(data => {
                setPet({ ...pet, vaccinations: [...pet.vaccinations, data.vaccination] });
                setNewVaccination({ vaccineName: '', date: '', notes: '', nextVaccinationDate: '' });
                toast.success('Vaccination added');
            })
            .catch(err => console.error('Error adding vaccination:', err));
    };

    const addVetAppointment = (appointment) => {
        fetch(`http://localhost:3000/add-vet-appointment/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointment)
        })
            .then(res => res.json())
            .then(data => {
                toast.success('Vet appointment added');
                setPet({ ...pet, vetAppointments: [...pet.vetAppointments, data.pet.vetAppointments[data.pet.vetAppointments.length - 1]] });
            })
            .catch(err => console.error('Error adding vet appointment:', err));
    };

    const searchAppointment = () => {
        const appointment = pet.vetAppointments.find(
            (a) =>
                a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (a.notes && a.notes.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        if (appointment) {
            setSelectedAppointment(appointment);
            toast.success('Appointment found! You can now edit or delete it.');
        } else {
            setSelectedAppointment(null);
            toast.error('No appointment found matching the search query.');
        }
    };

    const updateAppointment = () => {
        if (!selectedAppointment || !selectedAppointment._id) {
            toast.error('No appointment selected to update. Please search and select an appointment.');
            return;
        }

        fetch(`http://localhost:3000/edit-vet-appointment/${id}/${selectedAppointment._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctorName: selectedAppointment.doctorName,
                address: selectedAppointment.address,
                dateOfAppointment: selectedAppointment.dateOfAppointment,
                notes: selectedAppointment.notes,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to update appointment');
                }
                return res.json();
            })
            .then((data) => {
                toast.success('Appointment updated successfully');
                setPet((prevPet) => ({
                    ...prevPet,
                    vetAppointments: prevPet.vetAppointments.map((a) =>
                        a._id === selectedAppointment._id ? data.pet.vetAppointments.find((ap) => ap._id === a._id) : a
                    ),
                }));
                setShowEditMenu(false);
            })
            .catch((err) => {
                console.error('Error updating appointment:', err);
                toast.error('Error updating appointment. Please try again.');
            });
    };

    const deleteAppointment = () => {
        fetch(`http://localhost:3000/delete-vet-appointment/${id}/${selectedAppointment._id}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then(() => {
                toast.success('Appointment deleted successfully');
                setPet({
                    ...pet,
                    vetAppointments: pet.vetAppointments.filter((a) => a._id !== selectedAppointment._id),
                });
                setShowEditMenu(false);
            })
            .catch((err) => console.error('Error deleting appointment:', err));
    };

    const searchVaccination = () => {
        const vaccination = pet.vaccinations.find(
            (v) =>
                v.vaccineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (v.notes && v.notes.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        if (vaccination) {
            setSelectedVaccination(vaccination);
            toast.success('Vaccination found! You can now edit or delete it.');
        } else {
            setSelectedVaccination(null);
            toast.error('No vaccination found matching the search query.');
        }
    };

    const updateVaccination = () => {
        if (!selectedVaccination || !selectedVaccination._id) {
            toast.error('No vaccination selected to update. Please search and select a vaccination.');
            return;
        }

        fetch(`http://localhost:3000/edit-vaccination/${id}/${selectedVaccination._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedVaccination),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to update vaccination');
                }
                return res.json();
            })
            .then((data) => {
                toast.success('Vaccination updated successfully');
                setPet((prevPet) => ({
                    ...prevPet,
                    vaccinations: prevPet.vaccinations.map((v) =>
                        v._id === selectedVaccination._id ? data.vaccination : v
                    ),
                }));
                setShowEditMenu(false);
            })
            .catch((err) => {
                console.error('Error updating vaccination:', err);
                toast.error('Error updating vaccination. Please try again.');
            });
    };

    const deleteVaccination = () => {
        fetch(`http://localhost:3000/delete-vaccination/${id}/${selectedVaccination._id}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then(() => {
                toast.success('Vaccination deleted successfully');
                setPet({
                    ...pet,
                    vaccinations: pet.vaccinations.filter((v) => v._id !== selectedVaccination._id),
                });
                setShowEditMenu(false);
            })
            .catch((err) => console.error('Error deleting vaccination:', err));
    };

    return (
        <div className="edit-pet-profile-container">
            <ToastContainer />
            <div className="edit-pet-profile-wrapper">
                <h1 className="edit-pet-profile-title">Edit Pet Profile</h1>

                {/* Pet Profile Fields */}
                <div className="edit-pet-profile-fields">
                    <input
                        type="text"
                        name="name"
                        value={pet.name}
                        onChange={handleInputChange}
                        placeholder="Pet Name"
                        className="edit-pet-profile-input"
                    />
                    <input
                        type="text"
                        name="breed"
                        value={pet.breed}
                        onChange={handleInputChange}
                        placeholder="Breed"
                        className="edit-pet-profile-input"
                    />
                    <div>
                        <label className="edit-pet-profile-label">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            required
                            placeholder="Update your pet's description (max 70 words)"
                            maxLength="350"
                            className="edit-pet-profile-textarea"
                        ></textarea>
                        <span className="edit-pet-profile-note">Max 70 words</span>
                    </div>
                    <input
                        type="text"
                        name="image"
                        value={pet.image}
                        onChange={handleInputChange}
                        placeholder="Image URL"
                        className="edit-pet-profile-input"
                    />
                    <input
                        type="date"
                        name="dob"
                        value={pet.dob ? new Date(pet.dob).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        placeholder="Date of Birth"
                        className="edit-pet-profile-input"
                    />
                    <button
                        onClick={updatePetProfile}
                        className="edit-pet-profile-button"
                    >
                        Update Profile
                    </button>
                </div>

                {/* Add Vaccination Section */}
                <div className="edit-pet-profile-section">
                    <h2 className="edit-pet-profile-subtitle">Add Vaccination</h2>
                    <input
                        type="text"
                        name="vaccineName"
                        value={newVaccination.vaccineName}
                        onChange={handleVaccinationChange}
                        placeholder="Vaccine Name"
                        className="edit-pet-profile-input"
                    />
                    <input
                        type="date"
                        name="date"
                        value={newVaccination.date}
                        onChange={handleVaccinationChange}
                        className="edit-pet-profile-input"
                    />
                    <textarea
                        name="notes"
                        value={newVaccination.notes}
                        onChange={handleVaccinationChange}
                        placeholder="Notes"
                        className="edit-pet-profile-textarea"
                    />
                    <input
                        type="date"
                        name="nextVaccinationDate"
                        value={newVaccination.nextVaccinationDate}
                        onChange={handleVaccinationChange}
                        className="edit-pet-profile-input"
                    />
                    <div className="edit-pet-profile-buttons">
                        <button
                            onClick={addVaccination}
                            className="edit-pet-profile-button"
                            style={{ backgroundColor: '#28a745' }} // Green color for Add Vaccination
                        >
                            Add Vaccination
                        </button>
                        <button
                            onClick={() => {
                                toggleEditMenu('vaccination');
                                if (pet.vaccinations?.length > 0) {
                                    setSelectedVaccination(pet.vaccinations[0]);
                                }
                            }}
                            className="edit-pet-profile-button"
                            style={{ backgroundColor: '##17a2b8' }} // Blue color for Update Vaccination
                        >
                            Update Vaccination
                        </button>
                    </div>
                </div>

                {/* Vet Appointment Section */}
                <div className="edit-pet-profile-section">
                    <h2 className="edit-pet-profile-subtitle">Add Vet Appointment</h2>
                    <div className="edit-pet-profile-fields">
                        <input
                            type="text"
                            name="doctorName"
                            value={newAppointment.doctorName}
                            onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                            placeholder="Enter Doctor Name"
                            className="edit-pet-profile-input"
                        />
                        <input
                            type="text"
                            name="address"
                            value={newAppointment.address}
                            onChange={(e) => setNewAppointment({ ...newAppointment, address: e.target.value })}
                            placeholder="Enter Address"
                            className="edit-pet-profile-input"
                        />
                        <input
                            type="date"
                            name="dateOfAppointment"
                            value={newAppointment.dateOfAppointment}
                            onChange={(e) => setNewAppointment({ ...newAppointment, dateOfAppointment: e.target.value })}
                            className="edit-pet-profile-input"
                        />
                        <textarea
                            name="notes"
                            value={newAppointment.notes}
                            onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                            placeholder="Enter Notes"
                            className="edit-pet-profile-textarea"
                        />
                    </div>
                    <div className="edit-pet-profile-buttons">
                        <button
                            onClick={() => {
                                addVetAppointment(newAppointment);
                                setNewAppointment({ doctorName: '', address: '', dateOfAppointment: '' });
                            }}
                            className="edit-pet-profile-button"
                            style={{ backgroundColor: '#28a745' }} // Red color for Add Appointment
                        >
                            Save New Appointment
                        </button>
                        <button
                            onClick={() => {
                                toggleEditMenu('appointment');
                                if (pet.vetAppointments?.length > 0) {
                                    setSelectedAppointment(pet.vetAppointments[0]);
                                }
                            }}
                            className="edit-pet-profile-button"
                            style={{ backgroundColor: '##17a2b8' }} // Orange color for Update Appointment
                        >
                            Update Appointment
                        </button>
                    </div>
                </div>

                {/* Single unified edit menu for both vaccinations and appointments */}
                {showEditMenu && (
                    <div className="edit-pet-profile-overlay">
                        <div className="edit-pet-profile-menu">
                            <h2 className="edit-pet-profile-subtitle">
                                {selectedVaccination ? 'Edit Vaccination' : 'Edit Appointment'}
                            </h2>
                            
                            <div className="search-section">
                                <input
                                    type="text"
                                    placeholder="Search by name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="edit-pet-profile-input"
                                />
                                <button
                                    onClick={selectedVaccination ? searchVaccination : searchAppointment}
                                    className="edit-pet-profile-button"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Edit Forms */}
                            {selectedVaccination && (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        value={selectedVaccination.vaccineName || ''}
                                        onChange={(e) => setSelectedVaccination({ ...selectedVaccination, vaccineName: e.target.value })}
                                        placeholder="Vaccine Name"
                                        className="edit-pet-profile-input"
                                    />
                                    <input
                                        type="date"
                                        value={selectedVaccination.date || ''}
                                        onChange={(e) => setSelectedVaccination({ ...selectedVaccination, date: e.target.value })}
                                        className="edit-pet-profile-input"
                                    />
                                    <textarea
                                        value={selectedVaccination.notes || ''}
                                        onChange={(e) => setSelectedVaccination({ ...selectedVaccination, notes: e.target.value })}
                                        placeholder="Notes"
                                        className="edit-pet-profile-textarea"
                                    />
                                    <input
                                        type="date"
                                        value={selectedVaccination.nextVaccinationDate || ''}
                                        onChange={(e) => setSelectedVaccination({ ...selectedVaccination, nextVaccinationDate: e.target.value })}
                                        className="edit-pet-profile-input"
                                    />
                                    <div className="button-group">
                                        <button onClick={updateVaccination} className="edit-pet-profile-button">
                                            Save Changes
                                        </button>
                                        <button onClick={deleteVaccination} className="edit-pet-profile-button delete">
                                            Delete Vaccination
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedAppointment && (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        value={selectedAppointment.doctorName || ''}
                                        onChange={(e) => setSelectedAppointment({ ...selectedAppointment, doctorName: e.target.value })}
                                        placeholder="Doctor Name"
                                        className="edit-pet-profile-input"
                                    />
                                    <input
                                        type="text"
                                        value={selectedAppointment.address || ''}
                                        onChange={(e) => setSelectedAppointment({ ...selectedAppointment, address: e.target.value })}
                                        placeholder="Address"
                                        className="edit-pet-profile-input"
                                    />
                                    <input
                                        type="date"
                                        value={selectedAppointment.dateOfAppointment || ''}
                                        onChange={(e) => setSelectedAppointment({ ...selectedAppointment, dateOfAppointment: e.target.value })}
                                        className="edit-pet-profile-input"
                                    />
                                    <textarea
                                        value={selectedAppointment.notes || ''}
                                        onChange={(e) => setSelectedAppointment({ ...selectedAppointment, notes: e.target.value })}
                                        placeholder="Notes"
                                        className="edit-pet-profile-textarea"
                                    />
                                    <div className="button-group">
                                        <button onClick={updateAppointment} className="edit-pet-profile-button">
                                            Save Changes
                                        </button>
                                        <button onClick={deleteAppointment} className="edit-pet-profile-button delete">
                                            Delete Appointment
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setShowEditMenu(false)}
                                className="edit-pet-profile-button close"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditPetProfile;
