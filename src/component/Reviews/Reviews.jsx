import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';
import axios from 'axios';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ content: '', rating: 5 });
    const [editingReview, setEditingReview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'rating'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const isReviewPage = location.pathname === '/reviews';

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setError(null);
            const response = await axios.get('http://localhost:3000/api/reviews', { 
                withCredentials: true 
            });
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Failed to load reviews. Please try again later.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please login to post a review');
            navigate('/login');
            return;
        }
        try {
            setError(null);
            if (editingReview) {
                const response = await axios.put(
                    `http://localhost:3000/api/reviews/${editingReview._id}`,
                    newReview,
                    { 
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                setReviews(prevReviews => 
                    prevReviews.map(review => 
                        review._id === editingReview._id ? response.data : review
                    )
                );
                setEditingReview(null);
            } else {
                const response = await axios.post(
                    'http://localhost:3000/api/reviews',
                    newReview,
                    { 
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                setReviews(prevReviews => [response.data, ...prevReviews]);
            }
            setNewReview({ content: '', rating: 5 });
            setShowForm(false);
        } catch (error) {
            console.error('Error with review:', error);
            setError(error.response?.data?.message || 'Failed to process review. Please try again.');
        }
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setNewReview({ content: review.content, rating: review.rating });
        setShowForm(true);
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }
        try {
            await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
                withCredentials: true
            });
            setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
            setError(error.response?.data?.message || 'Failed to delete review. Please try again.');
        }
    };

    const handlePostReviewClick = () => {
        if (!user) {
            setError('Please login to post a review');
            navigate('/login');
            return;
        }
        if (isReviewPage) {
            setEditingReview(null);
            setNewReview({ content: '', rating: 5 });
            setShowForm(!showForm);
        } else {
            navigate('/reviews');
        }
    };

    const sortReviews = (reviewsToSort) => {
        return [...reviewsToSort].sort((a, b) => {
            if (sortBy === 'date') {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            } else {
                return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
            }
        });
    };

    const userReviews = reviews.filter(review => user && review.userId?._id === user.id);
    const otherReviews = reviews.filter(review => !user || review.userId?._id !== user.id);

    const sortedUserReviews = sortReviews(userReviews);
    const sortedOtherReviews = sortReviews(otherReviews);

    const ReviewCard = ({ review }) => (
        <div className="p-6 transition-all duration-300 transform border border-gray-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl hover:scale-105 hover:border-pink-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full shadow-md bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                        {review.userId?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{review.userId?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full bg-pink-50">
                    <span className="text-xl tracking-wider text-yellow-400">{'★'.repeat(review.rating)}</span>
                    <span className="text-xl tracking-wider text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                </div>
            </div>
            <p className="mb-4 leading-relaxed text-gray-700">{review.content}</p>
            {user && review.userId?._id === user.id && (
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={() => handleEdit(review)}
                        className="px-3 py-1 text-sm text-indigo-600 transition-colors duration-300 border border-indigo-100 rounded-full bg-indigo-50 hover:bg-indigo-100"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(review._id)}
                        className="px-3 py-1 text-sm text-red-600 transition-colors duration-300 border border-red-100 rounded-full bg-red-50 hover:bg-red-100"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold text-center text-gray-800">
                        Customer Reviews
                    </h1>
                    <p className="max-w-2xl mx-auto text-center text-gray-600">
                        Share your experience and help others make informed decisions about their pet care needs
                    </p>
                </div>

                {error && (
                    <div className="p-4 mb-4 text-red-600 border border-red-200 shadow-lg bg-red-50 rounded-2xl">
                        {error}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <div className="sticky top-4">
                            <button
                                onClick={handlePostReviewClick}
                                className="w-full p-6 transition-all duration-300 transform border border-gray-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl hover:scale-105 hover:border-pink-200"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-2 text-3xl">⭐</div>
                                    <h2 className="mb-2 text-lg font-bold text-gray-800">
                                        {editingReview ? 'Edit Your Review' : 'Share Your Experience'}
                                    </h2>
                                    <p className="mb-3 text-sm text-gray-600">
                                        {editingReview 
                                            ? 'Update your feedback to help us improve'
                                            : 'Help others by sharing your experience'}
                                    </p>
                                    <span className="px-6 py-2 font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 hover:shadow-xl hover:scale-105">
                                        {showForm && isReviewPage ? 'Cancel Review' : editingReview ? 'Edit Review' : 'Write a Review'}
                                    </span>
                                </div>
                            </button>

                            <div className="p-4 mt-4 border border-gray-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">Sort Reviews</h3>
                                <div className="flex gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="flex-1 p-2 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                                    >
                                        <option value="date">Sort by Date</option>
                                        <option value="rating">Sort by Rating</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                        className="p-2 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-xl hover:border-pink-400"
                                    >
                                        {sortOrder === 'desc' ? '↓' : '↑'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {showForm && isReviewPage && (
                            <form onSubmit={handleSubmit} className="p-6 mb-8 space-y-4 transition-all duration-300 transform border border-gray-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl hover:scale-105">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Rating</label>
                                    <div className="flex gap-2 mb-4">
                                        {[5, 4, 3, 2, 1].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setNewReview(prev => ({ ...prev, rating: num }))}
                                                className={`flex-1 py-2 rounded-xl text-lg transition-all duration-300 ${
                                                    newReview.rating === num
                                                        ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white shadow-md'
                                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                            >
                                                {'★'.repeat(num)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Your Review</label>
                                    <textarea
                                        value={newReview.content}
                                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                        className="w-full rounded-xl border-gray-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 p-4 min-h-[120px] transition-all duration-300"
                                        placeholder="Share your experience with our services..."
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-xl hover:shadow-xl hover:scale-105"
                                >
                                    {editingReview ? 'Update Review' : 'Submit Review'}
                                </button>
                            </form>
                        )}

                        {user && sortedUserReviews.length > 0 && (
                            <div className="mb-8">
                                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                                    Your Reviews
                                </h2>
                                <div className="grid gap-6">
                                    {sortedUserReviews.map((review) => (
                                        <ReviewCard key={review._id} review={review} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-gray-800">
                                {user ? 'Other Reviews' : 'All Reviews'}
                            </h2>
                            <div className="grid gap-6">
                                {sortedOtherReviews.map((review) => (
                                    <ReviewCard key={review._id} review={review} />
                                ))}
                            </div>
                        </div>

                        {reviews.length === 0 && (
                            <div className="py-12 text-center border border-gray-100 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                                <div className="mb-4 text-4xl">⭐</div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-800">No Reviews Yet</h3>
                                <p className="text-gray-600">Be the first to share your experience!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;