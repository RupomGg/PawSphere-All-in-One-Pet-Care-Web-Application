import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from "../../assets/360_F_700887990_N5qrQLgFO8zgzmqRXbS4m4dRKHValmPM.jpg";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <style>
                {`
                    .text-shadow-md {
                        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
                    }
                `}
            </style>

            <div className="min-h-screen hero relative" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', width: '100vw' }}>
                <div className="absolute top-10 left-10 text-left flex flex-col items-start space-y-5">
                    <div className="max-w-md">
                        {/* Title with white text color, increased opacity and shadow */}
                        <h1 className="mb-5 text-5xl font-bold text-white opacity-100 text-shadow-md">
                            PetSphere - Your Pet's Best Friend
                        </h1>
                        {/* Description with white text color, increased opacity and shadow */}
                        <p className="mb-5 text-xl text-white opacity-100 text-shadow-md">
                            Your one-stop platform for all your pet care needs. Join our community of pet lovers today!
                        </p>
                    </div>
                    {/* Get Started Button */}
                    <button 
                        className="btn bg-gradient-to-r from-purple-600 to-blue-500 text-white border-none rounded-lg py-3 px-8 text-lg font-semibold opacity-90 hover:bg-opacity-80 hover:shadow-xl transition-all duration-300"
                        onClick={() => navigate('/login')}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
