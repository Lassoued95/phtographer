// contexts/ReviewContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Review {
  id?: string;
  name: string;
  location?: string;
  text: string;
  rating: number;
  createdAt?: any;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
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
    
    // Create a query to order reviews by creation date (newest first)
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
          console.log('Review data:', data);
          
          return {
            id: doc.id,
            name: data.name || 'Anonymous',
            location: data.location || '',
            text: data.text || '',
            rating: data.rating || 5,
            createdAt: data.createdAt
          } as Review;
        });
        
        console.log('Processed reviews:', fetchedReviews);
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

  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      console.log('Adding review:', review);
      
      const reviewData = {
        ...review,
        createdAt: new Date(),
        // Ensure all required fields are present
        name: review.name || 'Anonymous',
        location: review.location || '',
        text: review.text || '',
        rating: review.rating || 5
      };
      
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('Review added with ID:', docRef.id);
    } catch (error) {
      console.error('Failed to add review to Firestore:', error);
      setError('Failed to add review');
      throw error;
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, loading, error }}>
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