import React from 'react';
import { Link } from 'react-router-dom';
import "../Desgine/PetCard.css";

const PetCard = ({ pet }) => {
    if (!pet) {
        return null;
    }

    const {
        _id,
        name,
        age,
        breed,
        image,
        description
    } = pet;

    return (
        <div className="pet-card">
            <div className="pet-card-image-container">
                <img 
                    src={image} 
                    alt={name} 
                    className="pet-card-image"
                />
            </div>
            <div className="pet-card-content">
                <h2 className="pet-card-title">{name}</h2>
                <p className="pet-card-description">{description}</p>
                <div className="pet-card-details">
                    <p className="pet-card-detail">
                        🐾 <span>Breed:</span> {breed}
                    </p>
                    <p className="pet-card-detail">
                        🎂 <span>Age:</span> {age}
                    </p>
                </div>
                <Link
                    to={`/pet/${_id}`}
                    className="pet-card-link"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default PetCard;
