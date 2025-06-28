// contexts/ReviewContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { getUserId } from '../utils/userUtils';

interface Review {
  id?: string;
  name: string;
  location?: string;
  text: string;
  rating: number;
  imageUrl?: string;
  userId?: string;
  createdAt?: any;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'imageUrl' | 'userId'> & { image?: File | null }) => Promise<void>;
  updateReview: (reviewId: string, updates: Partial<Review> & { image?: File | null }) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up Firestore listener...');
    
    const reviewsQuery = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        console.log('Firestore snapshot received:', snapshot.size, 'documents');
        
        const fetchedReviews = snapshot.docs.map(doc => {
          const data = doc.data();
          
          return {
            id: doc.id,
            name: data.name || 'Anonymous',
            location: data.location || '',
            text: data.text || '',
            rating: data.rating || 5,
            imageUrl: data.imageUrl || '',
            userId: data.userId || '',
            createdAt: data.createdAt
          } as Review;
        });
        
        setReviews(fetchedReviews);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Failed to listen to reviews:', error);
        setError('Failed to load reviews');
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up Firestore listener');
      unsubscribe();
    };
  }, []);

  const uploadImageFast = async (image: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `review-${timestamp}.jpg`; // Always use .jpg for consistency
    
    const imageRef = ref(storage, `review-images/${fileName}`);
    
    // Ultra-fast upload with minimal metadata
    const uploadResult = await uploadBytes(imageRef, image, {
      cacheControl: 'public,max-age=3600', // Cache for faster loading
    });
    
    return await getDownloadURL(uploadResult.ref);
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'imageUrl' | 'userId'> & { image?: File | null }) => {
    try {
      console.log('Adding review...');
      
      // First, add the review without image for immediate feedback
      const reviewData = {
        name: review.name || 'Anonymous',
        location: review.location || '',
        text: review.text || '',
        rating: review.rating || 5,
        imageUrl: '', // Will be updated if image exists
        userId: getUserId(),
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('Review added successfully with ID:', docRef.id);
      
      // If there's an image, upload it and update the review
      if (review.image) {
        console.log('Uploading image in background...');
        try {
          const imageUrl = await uploadImageFast(review.image);
          await updateDoc(doc(db, 'reviews', docRef.id), { imageUrl });
          console.log('Image uploaded and review updated');
        } catch (imageError) {
          console.error('Image upload failed, but review was saved:', imageError);
          // Review is still saved, just without image
        }
      }
      
    } catch (error) {
      console.error('Failed to add review:', error);
      throw new Error('Failed to add review. Please try again.');
    }
  };

  const updateReview = async (reviewId: string, updates: Partial<Review> & { image?: File | null }) => {
    try {
      console.log('Updating review:', reviewId);
      
      // Check if user owns this review
      const review = reviews.find(r => r.id === reviewId);
      if (!review || review.userId !== getUserId()) {
        throw new Error('You can only edit your own reviews.');
      }
      
      const updateData: any = { ...updates };
      delete updateData.image;
      delete updateData.userId;
      
      // Update review first (without image)
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, updateData);
      console.log('Review text updated successfully');
      
      // Handle image update separately for speed
      if (updates.image) {
        console.log('Uploading new image...');
        try {
          const imageUrl = await uploadImageFast(updates.image);
          await updateDoc(reviewRef, { imageUrl });
          console.log('New image uploaded successfully');
        } catch (imageError) {
          console.error('Image upload failed, but review text was updated:', imageError);
          // Review text is still updated, just image failed
        }
      }
      
    } catch (error) {
      console.error('Failed to update review:', error);
      throw error instanceof Error ? error : new Error('Failed to update review. Please try again.');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      console.log('Deleting review:', reviewId);
      
      // Check if user owns this review
      const review = reviews.find(r => r.id === reviewId);
      if (!review || review.userId !== getUserId()) {
        throw new Error('You can only delete your own reviews.');
      }
      
      // Delete review document first for immediate UI feedback
      const reviewRef = doc(db, 'reviews', reviewId);
      await deleteDoc(reviewRef);
      console.log('Review deleted successfully');
      
      // Delete image from storage in background
      if (review?.imageUrl) {
        try {
          const imageRef = ref(storage, review.imageUrl);
          await deleteObject(imageRef);
          console.log('Image deleted from storage');
        } catch (imageError) {
          console.warn('Failed to delete image from storage (review still deleted):', imageError);
        }
      }
      
    } catch (error) {
      console.error('Failed to delete review:', error);
      throw error instanceof Error ? error : new Error('Failed to delete review. Please try again.');
    }
  };

  return (
    <ReviewContext.Provider value={{ 
      reviews, 
      addReview, 
      updateReview, 
      deleteReview, 
      loading, 
      error 
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviewContext must be used within a ReviewProvider');
  }
  return context;
};