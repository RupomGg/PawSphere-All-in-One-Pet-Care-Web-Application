import React, { useEffect, useState } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { IoIosNotifications } from "react-icons/io";
import { FaCheck, FaTrash, FaCalendarAlt, FaSyringe } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'vaccination', 'appointment'

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/notifications', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            setError('Failed to fetch notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Set up polling every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}`, {
                method: 'PATCH',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            setNotifications(notifications.filter((notification) => notification._id !== notificationId));
        } catch (err) {
            setError('Failed to mark notification as read');
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete notification');
            }

            setNotifications(notifications.filter((notification) => notification._id !== notificationId));
        } catch (err) {
            setError('Failed to delete notification');
        }
    };
// naimut start
    const getNotificationType = (message) => {
        if (message.toLowerCase().includes('vaccination')) return 'vaccination';
        if (message.toLowerCase().includes('appointment')) return 'appointment';
        return 'other';
    };

    const filteredNotifications = notifications.filter(notification => {
        if (activeTab === 'all') return !notification.isRead;
        return !notification.isRead && getNotificationType(notification.message) === activeTab;
    });
// naimur end

    if (error) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
                {error}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-8 bg-gray-50">
            <div className="max-w-4xl px-4 mx-auto">
                {/* Header Section */}
                <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
                            <IoIosNotifications className="text-orange-500" />
                            Notifications
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
                                {notifications.filter(n => !n.isRead).length} new
                            </span>
                        </div>
                    </div>
                    {/* alvee end */}

                    {/* naimur start Filter Tabs */}
                    <div className="flex gap-4 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-2 px-4 font-medium text-sm ${
                                activeTab === 'all'
                                    ? 'text-orange-500 border-b-2 border-orange-500'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            All Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('vaccination')}
                            className={`pb-2 px-4 font-medium text-sm flex items-center gap-2 ${
                                activeTab === 'vaccination'
                                    ? 'text-orange-500 border-b-2 border-orange-500'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {/* FaSyringe icon */}
                            <FaSyringe /> 
                            Vaccinations
                        </button>
                        <button
                            onClick={() => setActiveTab('appointment')}
                            className={`pb-2 px-4 font-medium text-sm flex items-center gap-2 ${
                                activeTab === 'appointment'
                                    ? 'text-orange-500 border-b-2 border-orange-500'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaCalendarAlt />
                            Appointments
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="py-12 text-center bg-white rounded-lg shadow-sm">
                        <IoIosNotifications className="mx-auto mb-4 text-6xl text-gray-300" />
                        <p className="text-lg text-gray-500">No notifications available</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="space-y-4">
                            {filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm"
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getNotificationType(notification.message) === 'vaccination' ? (
                                                        <FaSyringe className="text-blue-500" />
                                                    ) : (
                                                        <FaCalendarAlt className="text-purple-500" />
                                                    )}
                                                    <p className="text-lg font-medium text-gray-800">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <FaCalendarAlt className="text-gray-400" />
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                {/* alvee start */}
                            <button
                                onClick={() => markAsRead(notification._id)}
                                                    className="p-2 text-green-600 transition-colors rounded-full hover:bg-green-50"
                                                    title="Mark as read"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => deleteNotification(notification._id)}
                                                    className="p-2 text-red-600 transition-colors rounded-full hover:bg-red-50"
                                                    title="Delete notification"
                                                >
                                                    <FaTrash />
                            </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                    ))}
                        </div>
                    </AnimatePresence>
            )}
            </div>
        </div>
    );
};

export default Notification;
