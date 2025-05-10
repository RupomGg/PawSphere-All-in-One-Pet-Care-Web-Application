import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';
import { FaBeer } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";


const Nav = () => {
    const navigate = useNavigate();
    const { user, logout, userInfo, setUserInfo } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // To manage dropdown state

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user?.id) {
                try {
                    const res = await fetch(`http://localhost:3000/user/${user.id}`, {
                        credentials: 'include'
                    });
                    const data = await res.json();
                    setUserInfo(data);
                } catch (err) {
                    console.error('Failed to load user info:', err);
                }
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    const loggedInLinks = (
        <>
            {/* Profile button */}
            <li>
                <button
                    onClick={() => navigate('/userprofile')}
                    className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg btn hover:bg-orange-600 hover:text-white"
                >
                    Profile
                </button>
            </li>

            {/* Pets button (only for logged-in users) */}
            <li>
                <NavLink to="/pets" className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg btn hover:bg-orange-600 hover:text-white">
                    Pets
                </NavLink>
            </li>
            

            {/* Logout */}
            <li>
                <button onClick={handleLogout} className="px-4 py-2 text-sm text-white transition-all duration-300 transform rounded-md shadow-lg btn btn-ghost hover:scale-105 hover:bg-red-600 bg-gradient-to-r from-red-500 via-red-600 to-red-700">
                    Logout
                </button>
            </li>
        </>
    );

    const loggedOutLinks = (
        <>
            <li><NavLink to="/login" className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg btn hover:bg-orange-600 hover:text-white">Login</NavLink></li>
            <li><NavLink to="/register" className="px-4 py-2 text-sm text-white transition-all duration-300 bg-orange-600 rounded-md shadow-lg btn hover:bg-orange-700">Register</NavLink></li>
        </>
    );

    const menuItems = user ? loggedInLinks : loggedOutLinks;

    return (
        <div className="p-0 m-0">
            <div className="w-full px-4 py-2 text-white navbar" style={{ 
                background: 'linear-gradient(90deg, rgb(88, 28, 135) 0%, rgb(168, 85, 247) 35%, rgb(192, 132, 252) 50%, rgb(168, 85, 247) 65%, rgb(88, 28, 135) 100%)',
                boxShadow: '0 2px 15px rgba(168, 85, 247, 0.3)'
            }}>
                <div className="navbar-start">
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            if (user) {
                                navigate('/user-home');
                            } else {
                                navigate('/');
                            }
                        }}
                        className="mb-2 text-3xl text-white normal-case btn btn-ghost custom-text-shadow"
                        to="#"
                    >
                        PetSphere🐾
                    </Link>
                </div>

                {/* Removed all buttons from the middle section (navbar-center) */}
                <div className="hidden navbar-center lg:flex">
                    {/* No buttons should be visible here at any point */}
                </div>

                {/* Added responsive behavior for collapsing buttons on smaller screens */}
                <div className="hidden space-x-4 navbar-end lg:flex">
                    {/* Show Login and Register buttons only when the user is logged out */}
                    {!user && (
                        <>
                            <NavLink to="/login" className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg hover:bg-orange-600 hover:text-white">
                                Login
                            </NavLink>
                            <NavLink to="/register" className="px-4 py-2 text-sm text-white transition-all duration-300 bg-orange-600 rounded-md shadow-lg hover:bg-orange-700">
                                Register
                            </NavLink>
                        </>
                    )}

                    {/* Show Profile, Pets, Logout buttons only when the user is logged in */}
                    {user && (
                        <>
                            <NavLink to="/userprofile" className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg hover:bg-orange-600 hover:text-white">
                                Profile
                            </NavLink>
                            <NavLink to="/pets" className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg hover:bg-orange-600 hover:text-white">
                                Pets
                            </NavLink>
                            <NavLink to="/notification" className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg hover:bg-orange-600 hover:text-white">
                            <IoIosNotifications />
                            </NavLink>
                            <NavLink to="/adoption" className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg hover:bg-orange-600 hover:text-white">
                            Adoption_List
                            </NavLink>
                            <NavLink to="/lostorfound" className="px-4 py-2 text-sm text-orange-600 transition-all duration-300 border-2 border-orange-600 rounded-md shadow-lg hover:bg-orange-600 hover:text-white">
                            Lost or found
                            </NavLink>
                            <button onClick={handleLogout} className="px-4 py-2 text-sm text-white transition-all duration-300 bg-red-500 rounded-md shadow-lg hover:bg-red-600">
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Dropdown menu for smaller screens */}
                <div className="navbar-end lg:hidden">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {!user && (
                                <>
                                    <li><NavLink to="/login">Login</NavLink></li>
                                    <li><NavLink to="/register">Register</NavLink></li>
                                </>
                            )}
                            {user && (
                                <>
                                    <li><NavLink to="/userprofile">Profile</NavLink></li>
                                    <li><NavLink to="/pets">Pets</NavLink></li>
                                    <li><button onClick={handleLogout}>Logout</button></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nav;
