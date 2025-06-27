// components/ReviewForm.tsx
import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';

interface Review {
  name: string;
  location?: string;
  text: string;
  rating: number;
}

const ReviewForm: React.FC = () => {
  const { addReview } = useReviewContext();

  const [formData, setFormData] = useState<Review>({
    name: '',
    location: '',
    text: '',
    rating: 0
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      await addReview(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', location: '', text: '', rating: 0 });
      }, 3000);
    } catch {
      alert('Something went wrong. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your review has been submitted and will appear after approval.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="review-name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="review-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            id="review-location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
            placeholder="e.g., UK Tourist, Local Business"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating *
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-colors duration-200 hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors duration-200 ${
                  star <= (hoveredRating || formData.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200 dark:hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
            {formData.rating > 0 && `${formData.rating} star${formData.rating > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Review *
        </label>
        <textarea
          id="review-text"
          name="text"
          required
          rows={4}
          value={formData.text}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 resize-none"
          placeholder="Share your experience working with me..."
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Submit Review
        <Send className="ml-2 h-5 w-5" />
      </button>
    </form>
  );
};

export default ReviewForm;
