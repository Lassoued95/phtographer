// components/ReviewList.tsx
import React from 'react';
import { useReviewContext } from '../contexts/ReviewContext';

const ReviewList: React.FC = () => {
  const { reviews } = useReviewContext();

  if (!reviews.length) {
    return <p className="text-center text-gray-600 dark:text-gray-400">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div
          key={index}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
            {review.name} {review.location ? `from ${review.location}` : ''}
          </h3>
          <p className="text-yellow-400 mb-2">
            {'⭐'.repeat(review.rating)}{' '}
            <span className="text-gray-500 dark:text-gray-400">({review.rating})</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
