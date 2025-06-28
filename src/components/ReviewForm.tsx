// components/ReviewForm.tsx
import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, Loader2, Edit, Save, XCircle as Cancel, X } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';

interface ReviewFormData {
  name: string;
  location: string;
  text: string;
  rating: number;
}

interface ReviewFormProps {
  editingReview?: {
    id: string;
    name: string;
    location?: string;
    text: string;
    rating: number;
  } | null;
  onCancelEdit?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ editingReview, onCancelEdit }) => {
  const { addReview, updateReview } = useReviewContext();

  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    location: '',
    text: '',
    rating: 0
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (editingReview) {
      setFormData({
        name: editingReview.name,
        location: editingReview.location || '',
        text: editingReview.text,
        rating: editingReview.rating
      });
    } else {
      setFormData({ name: '', location: '', text: '', rating: 0 });
    }
  }, [editingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.text.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingReview) {
        // Update existing review
        await updateReview(editingReview.id, {
          name: formData.name.trim(),
          location: formData.location.trim(),
          text: formData.text.trim(),
          rating: formData.rating
        });
        
        if (onCancelEdit) onCancelEdit();
      } else {
        // Add new review
        await addReview({
          name: formData.name.trim(),
          location: formData.location.trim(),
          text: formData.text.trim(),
          rating: formData.rating
        });
        
        // Show success immediately
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', location: '', text: '', rating: 0 });
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
    setError(null);
  };

  if (isSubmitted && !editingReview) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Your review has been submitted successfully and will appear shortly.
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          💡 Tip: You can edit or delete your review anytime by clicking the menu (⋮) on your review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {editingReview ? (
            <span className="flex items-center">
              <Edit className="h-6 w-6 mr-2 text-blue-600" />
              Edit Your Review
            </span>
          ) : (
            'Share Your Experience'
          )}
        </h2>
        {editingReview && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
              className="p-1 transition-colors duration-200 hover:scale-110 disabled:cursor-not-allowed"
              disabled={isSubmitting}
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
          disabled={isSubmitting}
        ></textarea>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              {editingReview ? 'Updating...' : 'Submitting...'}
            </>
          ) : (
            <>
              {editingReview ? (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Update Review
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Review
                </>
              )}
            </>
          )}
        </button>
        
        {editingReview && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center"
          >
            <Cancel className="mr-2 h-5 w-5" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;