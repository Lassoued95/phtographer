// components/ReviewList.tsx
import React, { useState } from 'react';
import { Star, Loader2, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';

const ReviewList: React.FC = () => {
  const { reviews, loading, error } = useReviewContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
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

            {/* Display uploaded image if available with optimized loading */}
            {review.imageUrl && (
              <div className="mb-4">
                <div className="relative w-full max-w-md">
                  <img
                    src={review.imageUrl}
                    alt="Review photo"
                    className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedImage(review.imageUrl!)}
                    loading="lazy" // Lazy loading for better performance
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
    </>
  );
};

export default ReviewList;