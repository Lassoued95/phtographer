// components/ReviewForm.tsx
import React, { useState } from 'react';
import { Star, Send, CheckCircle, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';

interface ReviewFormData {
  name: string;
  location: string;
  text: string;
  rating: number;
  image?: File | null;
}

const ReviewForm: React.FC = () => {
  const { addReview } = useReviewContext();

  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    location: '',
    text: '',
    rating: 0,
    image: null
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      await addReview({
        name: formData.name.trim(),
        location: formData.location.trim(),
        text: formData.text.trim(),
        rating: formData.rating,
        image: formData.image
      });
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', location: '', text: '', rating: 0, image: null });
        setImagePreview(null);
      }, 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
    setError(null);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your review has been submitted successfully and will appear shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Add a Photo (Optional)
        </label>
        
        {!imagePreview ? (
          <div className="relative">
            <input
              type="file"
              id="review-image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <label
              htmlFor="review-image"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or JPEG (MAX. 5MB)
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative">
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Review preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <ImageIcon className="h-4 w-4 mr-1" />
              Image ready to upload
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Submitting...
          </>
        ) : (
          <>
            Submit Review
            <Send className="ml-2 h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;