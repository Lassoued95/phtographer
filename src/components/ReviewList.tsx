// components/ReviewList.tsx
import React, { useState } from 'react';
import { Star, Loader2, AlertCircle, Image as ImageIcon, X, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';
import ReviewForm from './ReviewForm';

const ReviewList: React.FC = () => {
  const { reviews, deleteReview, loading, error } = useReviewContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [showMenuForReview, setShowMenuForReview] = useState<string | null>(null);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      await deleteReview(reviewId);
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeletingReviewId(null);
      setShowMenuForReview(null);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setShowMenuForReview(null);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-red-600">
        <AlertCircle className="h-6 w-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="text-center py-12">
        <Star className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
          No reviews yet. Be the first to leave a review!
        </p>
      </div>
    );
  }

  // Show edit form if editing
  if (editingReview) {
    return (
      <div className="space-y-6">
        <ReviewForm 
          editingReview={editingReview} 
          onCancelEdit={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
          </h3>
        </div>
        
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 relative"
          >
            {/* Review Actions Menu */}
            <div className="absolute top-4 right-4">
              <div className="relative">
                <button
                  onClick={() => setShowMenuForReview(showMenuForReview === review.id ? null : review.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                
                {showMenuForReview === review.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center rounded-t-lg"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Review
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id!)}
                      disabled={deletingReviewId === review.id}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center rounded-b-lg disabled:opacity-50"
                    >
                      {deletingReviewId === review.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Review
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start justify-between mb-4 pr-8">
              <div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                  {review.name}
                  {review.location && (
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                      from {review.location}
                    </span>
                  )}
                </h4>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({review.rating}/5)
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              "{review.text}"
            </p>

            {/* Display uploaded image with optimized loading */}
            {review.imageUrl && (
              <div className="mb-4">
                <div className="relative w-full max-w-md">
                  <img
                    src={review.imageUrl}
                    alt="Review photo"
                    className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedImage(review.imageUrl!)}
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Photo
                  </div>
                </div>
              </div>
            )}
            
            {review.createdAt && (
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                {new Date(review.createdAt.toDate()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <img
              src={selectedImage}
              alt="Review photo enlarged"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenuForReview && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMenuForReview(null)}
        />
      )}
    </>
  );
};

export default ReviewList;