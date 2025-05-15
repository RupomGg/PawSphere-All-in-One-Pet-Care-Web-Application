import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Desgine/PetCard.css';

// Added by tarek - Modal styles configuration
const modalStyles = {
    overlay: `fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center p-4 z-50`,
    container: `bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col
        transform transition-all duration-300 border border-gray-200`,
    header: `flex justify-between items-center mb-6 pb-4 border-b`,
    title: `text-2xl font-bold text-gray-800`,
    closeButton: `p-2 hover:bg-gray-100 rounded-full transition-colors duration-200`,
    commentList: `flex-1 overflow-y-auto mb-6 pr-2 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] 
        [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-lg
        [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-lg
        [&::-webkit-scrollbar-thumb:hover]:bg-gray-400`,
    commentCard: `mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200`,
    avatar: `w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold`,
    commentMeta: `flex items-center gap-2 mb-1`,
    commentText: `text-gray-700 leading-relaxed`,
    inputContainer: `pt-4 border-t border-white`,
    input: `flex-1 px-4 py-3 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
        focus:border-transparent transition-all duration-200`,
    button: `px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2`
};

// Added by tarek - Comment Modal Component for lost/found pet posts
const CommentModal = ({ isOpen, onClose, comments, reportId, onAddComment }) => {
    const [newComment, setNewComment] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            onClick={handleClose}
            className={`${modalStyles.overlay} ${isAnimating ? 'bg-opacity-0' : 'bg-opacity-50'}`}
            style={{ animation: isAnimating ? 'fadeIn 0.3s ease-out forwards' : '' }}
        >
            <div 
                className={`${modalStyles.container} ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className={modalStyles.header}>
                    <h3 className={modalStyles.title}>Comments</h3>
                    <button onClick={onClose} className={modalStyles.closeButton}>
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className={modalStyles.commentList}>
                    {comments?.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className={modalStyles.commentCard}>
                                <div className="flex items-start gap-3">
                                    <div className={modalStyles.avatar}>
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className={modalStyles.commentMeta}>
                                            <span className="font-semibold text-gray-800">{comment.user.name}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className={modalStyles.commentText}>{comment.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-center">No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>

                <div className={modalStyles.inputContainer}>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className={modalStyles.input}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && newComment.trim()) {
                                    onAddComment(reportId, newComment);
                                    setNewComment('');
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                if (newComment.trim()) {
                                    onAddComment(reportId, newComment);
                                    setNewComment('');
                                }
                            }}
                            disabled={!newComment.trim()}
                            className={modalStyles.button}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Post
                        </button>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

// tarek end




// alvee start

const LostOrFound = () => {
    const [lostPets, setLostPets] = useState([]);
    const [comments, setComments] = useState({});
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLostPets();
    }, []);

    useEffect(() => {
        if (selectedReport) {
            fetchComments(selectedReport);
        }
    }, [selectedReport]);

    const fetchLostPets = async () => {
        try {
            const response = await fetch('http://localhost:3000/lost-pets', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setLostPets(data);
            }
        } catch (error) {
            console.error('Error fetching lost pets:', error);
        }
    };

    const handleMarkAsFound = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:3000/mark-found/${reportId}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                alert('Pet marked as found successfully!');
                fetchLostPets();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to mark pet as found');
            }
        } catch (error) {
            console.error('Error marking pet as found:', error);
            alert('Failed to mark pet as found');
        }
    };

    const fetchComments = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:3000/reports/${reportId}/comments`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setComments(prev => ({ ...prev, [reportId]: data }));
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (reportId, text) => {
        try {
            const response = await fetch(`http://localhost:3000/reports/${reportId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                fetchComments(reportId);
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    };

    return (
        <div className="p-6 mx-auto adoption-list max-w-7xl">
            <h2 className="mb-8 text-3xl font-extrabold text-center text-red-600">Lost Pets</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lostPets.map((report) => {
                    const { _id, petId, requestedBy, requestedAt, reviewedAt, status } = report;

                    return (
                        <div key={_id} className="pet-card">
                            <div className="pet-card-image-container">
                                <img
                                    src={petId.image}
                                    alt={petId.name}
                                    className="pet-card-image"
                                />
                            </div>
                            <div className="pet-card-content">
                                <h2 className="pet-card-title">{petId.name}</h2>
                                <p className="pet-card-description">{petId.description}</p>
                                <div className="pet-card-details">
                                    <p className="pet-card-detail">
                                        🐾 <span>Breed:</span> {petId.breed}
                                    </p>
                                    <p className="pet-card-detail">
                                        📅 <span>Reported on:</span> {new Date(requestedAt).toLocaleDateString()}
                                    </p>
                                    <p className="pet-card-detail">
                                        👤 <span>Reported by:</span> {requestedBy.name}
                                    </p>
                                </div>

                                {status === 'lost' && (
                                    <button
                                        onClick={() => handleMarkAsFound(_id)}
                                        className="block w-full py-2 text-center text-white transition duration-300 bg-green-500 rounded pet-card-link hover:bg-green-600 mb-2"
                                    >
                                        Mark as Found
                                    </button>
                                )}

                                {status === 'found' && (
                                    <div className="mt-2 mb-2 font-semibold text-center text-green-500">
                                        Found on {new Date(reviewedAt).toLocaleDateString()}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedReport(_id);
                                            setIsModalOpen(true);
                                        }}
                                        className="flex-1 py-2 text-center text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        View Comments ({comments[_id]?.length || 0})
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* alveeend */}

            

            {/* tarek start */}

            <CommentModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReport(null);
                }}
                comments={comments[selectedReport] || []}
                reportId={selectedReport}
                onAddComment={handleAddComment}
            />

            {lostPets.length === 0 && (
                <p className="mt-8 text-center text-gray-500">No lost pets reported</p>
            )}
        </div>
    );
};

export default LostOrFound;