import React, { useContext, useState } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Login = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const email = form.get('email');
        const password = form.get('password');

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server did not return JSON. Maybe a redirect or error page?");
            }

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setIsSuccess(true);
                setErrorMsg('');

                if (data.user.role === 'user') {
                    navigate('/user-home');
                } else if (data.user.role === 'admin') {
                    navigate('/admin-home');
                } else {
                    navigate('/');
                }
            } else {
                setErrorMsg(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMsg(error.message);
            setIsSuccess(false);
        }
    };

    return (
        <div className="min-h-screen hero flex justify-center items-start pt-12" style={{
            backgroundImage: `url('/src/assets/360_F_700887990_N5qrQLgFO8zgzmqRXbS4m4dRKHValmPM.jpg')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center'
        }}>
            <div className="w-full max-w-sm shadow-lg rounded-xl bg-white bg-opacity-50 backdrop-blur-lg p-8 space-y-6">
                <h3 className="text-3xl font-semibold text-center text-orange-500">Login</h3> {/* Updated color for Login text */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label text-black"> {/* Label color set to black */}
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input input-bordered bg-transparent border-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-gray-700 p-3 w-full"
                            required
                            aria-label="Email"
                        />
                    </div>
                    <div className="form-control relative">
                        <label className="label text-black"> {/* Label color set to black */}
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            aria-label="Password"
                            autocomplete="current-password" // Added autocomplete attribute
                            className="input input-bordered bg-transparent border-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg text-gray-700 p-3 w-full pr-12"
                            required
                        />
                        <div
                            className="absolute right-3 top-[calc(50%+16px)] transform -translate-y-1/2 cursor-pointer flex justify-center items-center"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? <HiOutlineEyeOff size={24} color="#1f283b" /> : <HiOutlineEye size={24} color="#1f283b" />}
                        </div>
                    </div>
                    <div className="form-control mt-4">
                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition duration-300 text-lg font-semibold"
                        >
                            Login
                        </button>
                    </div>
                    {errorMsg && <p className="text-red-500 text-center mt-2">{errorMsg}</p>}
                    {isSuccess && <p className="text-green-500 text-center mt-2">Login Successful!</p>}
                </form>
                <p className="text-center text-sm text-black">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-orange-500 hover:text-orange-600 underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
