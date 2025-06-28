// components/ReviewForm.tsx
import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, Loader2, Upload, X, Image as ImageIcon, Zap, Edit, Save, XCircle as Cancel } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';
import { compressImage, createImagePreview, validateImageFile } from '../utils/imageUtils';

interface ReviewFormData {
  name: string;
  location: string;
  text: string;
  rating: number;
  image?: File | null;
}

interface ReviewFormProps {
  editingReview?: {
    id: string;
    name: string;
    location?: string;
    text: string;
    rating: number;
    imageUrl?: string;
  } | null;
  onCancelEdit?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ editingReview, onCancelEdit }) => {
  const { addReview, updateReview } = useReviewContext();

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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<{ original: number; compressed: number } | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (editingReview) {
      setFormData({
        name: editingReview.name,
        location: editingReview.location || '',
        text: editingReview.text,
        rating: editingReview.rating,
        image: null
      });
      setImagePreview(editingReview.imageUrl || null);
    } else {
      setFormData({ name: '', location: '', text: '', rating: 0, image: null });
      setImagePreview(null);
      setCompressionInfo(null);
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
        await updateReview(editingReview.id, {
          name: formData.name.trim(),
          location: formData.location.trim(),
          text: formData.text.trim(),
          rating: formData.rating,
          image: formData.image
        });
        
        if (onCancelEdit) onCancelEdit();
      } else {
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
          setCompressionInfo(null);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setIsProcessingImage(true);
    setError(null);

    try {
      const originalSize = file.size;
      
      // Ultra-aggressive compression for sub-3-second uploads (400px, 60% quality)
      const compressedFile = await compressImage(file, 400, 0.6);
      const compressedSize = compressedFile.size;
      
      const preview = await createImagePreview(compressedFile);
      
      setFormData({ ...formData, image: compressedFile });
      setImagePreview(preview);
      setCompressionInfo({ original: originalSize, compressed: compressedSize });
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(editingReview?.imageUrl || null);
    setCompressionInfo(null);
  };

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isSubmitted && !editingReview) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Your review has been submitted successfully! 
          {formData.image && " Your photo is being uploaded in the background."}
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

      {/* Speed optimization notice */}
      {!editingReview && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300 text-sm flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            <strong>Fast Upload:</strong> Your review will be posted instantly. Photos are optimized for lightning-fast upload (under 3 seconds)!
          </p>
        </div>
      )}

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
            disabled={isSubmitting || isProcessingImage}
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
            disabled={isSubmitting || isProcessingImage}
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
              disabled={isSubmitting || isProcessingImage}
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
          disabled={isSubmitting || isProcessingImage}
        ></textarea>
      </div>

      {/* Ultra-Fast Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {editingReview ? 'Update Photo (Optional)' : 'Add a Photo (Optional)'}
          <span className="text-xs text-green-600 dark:text-green-400 ml-2">⚡ Lightning fast upload!</span>
        </label>
        
        {!imagePreview ? (
          <div className="relative">
            <input
              type="file"
              id="review-image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isSubmitting || isProcessingImage}
            />
            <label
              htmlFor="review-image"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                isProcessingImage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isProcessingImage ? (
                  <>
                    <Loader2 className="w-8 h-8 mb-2 text-green-500 animate-spin" />
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ⚡ Ultra-fast compression...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or JPEG (MAX. 3MB - optimized for instant upload)
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ⚡ Uploads in under 3 seconds!
                    </p>
                  </>
                )}
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
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                {formData.image ? 'Ready for instant upload!' : 'Current image'}
              </p>
              {compressionInfo && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Optimized: {formatFileSize(compressionInfo.original)} → {formatFileSize(compressionInfo.compressed)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || isProcessingImage}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              {editingReview ? 'Updating...' : 'Submitting...'}
            </>
          ) : isProcessingImage ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              ⚡ Optimizing...
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
                  Submit Review
                  <Send className="ml-2 h-5 w-5" />
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