// components/ReviewList.tsx
import React, { useState } from 'react';
import { Star, Loader2, AlertCircle, Edit, Trash2, MoreVertical, Lock } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';
import { isReviewOwner } from '../utils/userUtils';
import ReviewForm from './ReviewForm';

const ReviewList: React.FC = () => {
  const { reviews, deleteReview, loading, error } = useReviewContext();
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
      alert(error instanceof Error ? error.message : 'Failed to delete review. Please try again.');
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
        
        {reviews.map((review) => {
          const canEdit = isReviewOwner(review.userId);
          
          return (
            <div
              key={review.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 relative"
            >
              {/* Review Actions Menu - Only show for owned reviews */}
              {canEdit && (
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowMenuForReview(showMenuForReview === review.id ? null : review.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      title="Edit your review"
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
              )}

              {/* Ownership indicator for non-owned reviews */}
              {!canEdit && (
                <div className="absolute top-4 right-4">
                  <div className="p-2 text-gray-300 dark:text-gray-600" title="You can only edit your own reviews">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-4 pr-8">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                    {review.name}
                    {canEdit && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                        Your Review
                      </span>
                    )}
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
          );
        })}
      </div>

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