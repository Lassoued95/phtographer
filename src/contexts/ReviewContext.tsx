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
  userId?: string; // Track who created the review
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
            userId: data.userId || '', // Include user ID for ownership tracking
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

  const uploadImage = async (image: File): Promise<string> => {
    const timestamp = Date.now();
    const fileExtension = image.name.split('.').pop() || 'jpg';
    const fileName = `review-${timestamp}.${fileExtension}`;
    
    const imageRef = ref(storage, `review-images/${fileName}`);
    
    // Optimized upload with minimal metadata for speed
    const uploadResult = await uploadBytes(imageRef, image);
    return await getDownloadURL(uploadResult.ref);
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'imageUrl' | 'userId'> & { image?: File | null }) => {
    try {
      console.log('Adding review...');
      
      let imageUrl = '';
      
      if (review.image) {
        console.log('Uploading image...');
        imageUrl = await uploadImage(review.image);
        console.log('Image uploaded successfully');
      }
      
      const reviewData = {
        name: review.name || 'Anonymous',
        location: review.location || '',
        text: review.text || '',
        rating: review.rating || 5,
        imageUrl: imageUrl,
        userId: getUserId(), // Associate review with current user
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('Review added successfully with ID:', docRef.id);
      
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
      delete updateData.image; // Remove image from update data
      delete updateData.userId; // Don't allow changing userId
      
      // Handle image update
      if (updates.image) {
        console.log('Uploading new image...');
        updateData.imageUrl = await uploadImage(updates.image);
        console.log('New image uploaded successfully');
      }
      
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, updateData);
      console.log('Review updated successfully');
      
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
      
      // Delete image from storage if exists
      if (review?.imageUrl) {
        try {
          const imageRef = ref(storage, review.imageUrl);
          await deleteObject(imageRef);
          console.log('Image deleted from storage');
        } catch (imageError) {
          console.warn('Failed to delete image from storage:', imageError);
          // Continue with review deletion even if image deletion fails
        }
      }
      
      // Delete review document
      const reviewRef = doc(db, 'reviews', reviewId);
      await deleteDoc(reviewRef);
      console.log('Review deleted successfully');
      
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