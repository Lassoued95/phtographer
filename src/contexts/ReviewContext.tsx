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

  const uploadImageInBackground = async (image: File, reviewId: string): Promise<void> => {
    try {
      console.log('Starting background image upload for review:', reviewId);
      
      const timestamp = Date.now();
      const fileName = `review-${reviewId}-${timestamp}.jpg`;
      const imageRef = ref(storage, `review-images/${fileName}`);
      
      // Upload with minimal metadata for speed
      const uploadResult = await uploadBytes(imageRef, image, {
        cacheControl: 'public,max-age=3600',
      });
      
      const imageUrl = await getDownloadURL(uploadResult.ref);
      
      // Update the review with the image URL
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, { imageUrl });
      
      console.log('Background image upload completed successfully');
    } catch (error) {
      console.error('Background image upload failed:', error);
      // Don't throw error - review is already saved
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'imageUrl' | 'userId'> & { image?: File | null }) => {
    try {
      console.log('Adding review instantly...');
      
      // INSTANT SUBMISSION: Add review immediately without waiting for image
      const reviewData = {
        name: review.name || 'Anonymous',
        location: review.location || '',
        text: review.text || '',
        rating: review.rating || 5,
        imageUrl: '', // Will be updated in background if image exists
        userId: getUserId(),
        createdAt: new Date()
      };
      
      // This is the ONLY await in the submission process - super fast!
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('✅ Review submitted instantly with ID:', docRef.id);
      
      // Start background image upload WITHOUT awaiting it
      if (review.image) {
        console.log('🚀 Starting background image upload...');
        uploadImageInBackground(review.image, docRef.id).catch(error => {
          console.warn('Background image upload failed, but review was saved:', error);
        });
      }
      
      // Return immediately - don't wait for image upload!
      
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
      
      // Update review text instantly
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, updateData);
      console.log('✅ Review updated instantly');
      
      // Handle image update in background
      if (updates.image) {
        console.log('🚀 Starting background image update...');
        uploadImageInBackground(updates.image, reviewId).catch(error => {
          console.warn('Background image update failed, but review text was updated:', error);
        });
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
      
      // Delete review document instantly
      const reviewRef = doc(db, 'reviews', reviewId);
      await deleteDoc(reviewRef);
      console.log('✅ Review deleted instantly');
      
      // Delete image from storage in background
      if (review?.imageUrl) {
        try {
          const imageRef = ref(storage, review.imageUrl);
          deleteObject(imageRef).catch(error => {
            console.warn('Failed to delete image from storage (review still deleted):', error);
          });
        } catch (imageError) {
          console.warn('Image deletion error (review still deleted):', imageError);
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