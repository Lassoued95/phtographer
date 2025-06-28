import React from 'react';
import { Star } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';

const ReviewList: React.FC = () => {
  const { reviews, loading, error } = useReviewContext();

  if (loading) return <div className="text-center py-8 text-gray-500">Loading reviews...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!reviews.length) return <div className="text-center py-8 text-gray-500">No reviews yet.</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-all"
        >
          {/* Stars */}
          <div className="flex items-center mb-4">
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
          </div>

          {/* Quote */}
          <p className="text-gray-700 dark:text-gray-300 italic mb-4">"{review.text}"</p>

          {/* Name and Role */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
            {review.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{review.location}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
