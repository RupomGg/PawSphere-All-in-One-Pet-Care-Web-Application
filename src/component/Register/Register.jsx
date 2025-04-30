import React, { useContext, useState } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { Link } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'; // Eye icon for password visibility
import Swal from 'sweetalert2';

const Register = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // new state for success
    const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility toggle
    const [userType, setUserType] = useState('user'); // state to hold user type
    const { createNewUser, user, setUser } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const name = form.get('name');  // Get username
        const email = form.get('email');
        const password = form.get('password');
        const info = { name, email, password, role: userType }; // Create an object to send to the server

        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(info)
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    // Custom Success Pop-up with SweetAlert2
                    Swal.fire({
                        title: 'Success!',
                        text: 'You have been successfully registered.',
                        confirmButtonText: 'Cool',
                        confirmButtonColor: '#3B82F6', 
                        background: 'rgba(255, 255, 255, 0.8)', 
                        width: '400px', 
                        padding: '1.5rem', 
                        borderRadius: '10px', 
                        backdrop: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)', 
                        showClass: {
                            popup: 'animate__animated animate__fadeIn'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOut'
                        },
                        customClass: {
                            popup: 'rounded-lg shadow-lg'
                        }
                    }).then(() => {
                        setIsSuccess(true);
                    });
                } else if (data.message) {
                    setErrorMsg(data.message); 
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setErrorMsg('Something went wrong during registration.');
            });
    };

    const handlePasswordMismatch = () => {
        const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
        confirmPasswordInput.setCustomValidity("Passwords do not match!");
        confirmPasswordInput.reportValidity();
    };

    const clearCustomValidity = (e) => {
        e.target.setCustomValidity("");
    };

    return (
        <div className="min-h-screen hero flex justify-center items-start pt-12" style={{ 
            backgroundImage: `url('/src/assets/360_F_700887990_N5qrQLgFO8zgzmqRXbS4m4dRKHValmPM.jpg')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
        }}>
            <div className="w-full max-w-sm shadow-lg rounded-xl bg-white bg-opacity-50 backdrop-blur-lg p-8 space-y-6">
                <h3 className="text-3xl font-semibold text-center text-orange-500">Register</h3> 
                <form onSubmit={(e) => {
                    const form = e.target;
                    const password = form.password.value;
                    const confirmPassword = form.confirmPassword.value;
                    if (password !== confirmPassword) {
                        e.preventDefault();
                        handlePasswordMismatch();
                    } else {
                        handleSubmit(e);
                    }
                }} className="space-y-4">
                    <div className="form-control">
                        <label className="label text-black"> 
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Username"
                            className="input input-bordered bg-transparent border-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-gray-700 p-3 w-full"
                            required
                            aria-label="Username"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-black"> 
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="input input-bordered bg-transparent border-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-gray-700 p-3 w-full"
                            required
                            aria-label="Email"
                        />
                    </div>
                    <div className="form-control relative">
                        <label className="label text-black"> 
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="input input-bordered bg-transparent border-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-gray-700 p-3 w-full pr-12"
                            required
                            aria-label="Password"
                        />
                        <div
                            className="absolute right-3 top-[calc(50%+16px)] transform -translate-y-1/2 cursor-pointer flex justify-center items-center"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? <HiOutlineEyeOff size={24} color="#1f283b" /> : <HiOutlineEye size={24} color="#1f283b" />}
                        </div>
                    </div>
                    <div className="form-control relative">
                        <label className="label text-black"> 
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="input input-bordered bg-transparent border-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-gray-700 p-3 w-full pr-12"
                            required
                            aria-label="Confirm Password"
                            onInvalid={handlePasswordMismatch}
                            onInput={clearCustomValidity}
                        />
                    </div>

                    <div className="mt-6 form-control">
                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition duration-300 text-lg font-semibold"
                        >
                            Register
                        </button>
                    </div>
                    <div>
                        {errorMsg && <p className="mt-2 text-red-500">{errorMsg}</p>}
                        {isSuccess && <p className="mt-2 text-green-500">Successful</p>}
                    </div>
                </form>
                <p className="text-center text-sm text-black">
                    Already have an account?{' '}
                    <Link to='/login' className="text-orange-500 hover:text-orange-600 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
