import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';

import "../Desgine/UserProfile.css";

const UserProfile = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!userInfo?._id) {
            console.error('User ID is missing.');
            return;
        }

        fetch(`http://localhost:3000/profile/${userInfo._id}`)
            .then((response) => response.json())
            .then((data) => {
                setProfile(data);
                console.log("data", data);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
            });
    }, [userInfo?._id]);

    const handleMissingInfo = (value) => {
        return value ? value : 'NaN';
    };

    const handleEditClick = () => {
        navigate('/user-edit-profile');
    };

    if (!userInfo) {
        return (
            <div className="container">
                <p className="text-red-500">User information is missing. Please log in again.</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ backgroundImage: `url('/src/assets/bg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="profile-card">
                <div className="profile-header">
                    <h1>{handleMissingInfo(profile?.name)}'s Profile</h1>
                </div>

                <div className="profile-image">
                    <img
                        src={handleMissingInfo(profile?.image)}
                        alt="Profile"
                    />
                </div>

                <div className="profile-info">
                    <div className="flex items-center space-x-2">
                        <h2>Name:</h2>
                        <p>{handleMissingInfo(profile?.name)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <h2>Email:</h2>
                        <p>{handleMissingInfo(profile?.email)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <h2>Contact Info:</h2>
                        <p>{handleMissingInfo(profile?.contactInfo)}</p>
                    </div>
                </div>

                <div className="document-link">
                    <h2>Documents:</h2>
                    <p>
                        {profile?.documents ? (
                            <a href={profile?.documents} target="_blank" rel="noopener noreferrer">
                                View Document
                            </a>
                        ) : (
                            'NaN'
                        )}
                    </p>
                </div>

                <button onClick={handleEditClick} className="edit-button">
                    Edit
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
