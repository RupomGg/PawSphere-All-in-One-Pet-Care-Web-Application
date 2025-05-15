// Users Component - Admin Panel for User Management
// Author: Naimur
// This component provides an interface for administrators to view and manage user accounts
// Features:
// - Display list of all registered users
// - Ban/Unban user accounts
// - View user status and roles
// - Protected route (only accessible to admins)

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    // State management for users list, loading state, and error handling
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    // Check admin access on component mount
    useEffect(() => {
        // Redirect non-admin users to home page
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchUsers();
    }, [userInfo, navigate]);

    // Fetch all users from the backend
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/users', {
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message);
            // Show error message to user
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle ban/unban user action
    const handleBanUser = async (userId, isBanned) => {
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}/ban`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ banned: !isBanned })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user status');
            }

            // Refresh the users list after successful ban/unban
            await fetchUsers();
        } catch (err) {
            console.error('Error banning user:', err);
            setError(err.message);
            // Show error message to user
            alert(err.message);
        }
    };

    // Loading state UI
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
                <div className="flex justify-center items-center h-[80vh]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-blue-600 text-lg font-medium">Loading users...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state UI
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
                <div className="flex justify-center items-center h-[80vh]">
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-md w-full text-center">
                        <div className="text-red-500 text-4xl mb-2">⚠️</div>
                        <div className="text-red-600 text-lg font-medium mb-1">Error Loading Users</div>
                        <div className="text-gray-600">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    // Main users table UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Registered Users</h1>
                    
                    {/* Users table with columns for name, email, role, status, and actions */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        {/* User name cell */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        {/* User email cell */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        {/* User role cell with role-specific styling */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        {/* User status cell with ban status styling */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.banned 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.banned ? 'Banned' : 'Active'}
                                            </span>
                                        </td>
                                        {/* Actions cell with ban/unban button */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleBanUser(user._id, user.banned)}
                                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                        user.banned
                                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                                            : 'bg-red-500 hover:bg-red-600 text-white'
                                                    }`}
                                                >
                                                    {user.banned ? 'Unban' : 'Ban'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users; 