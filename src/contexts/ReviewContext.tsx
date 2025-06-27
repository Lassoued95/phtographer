// contexts/ReviewContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Review {
  name: string;
  location?: string;
  text: string;
  rating: number;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Review) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'reviews'),
    (snapshot) => {
      const fetched = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          name: data.name,
          location: data.location,
          text: data.text,
          rating: data.rating,
        } as Review;
      });
      setReviews(fetched);
    },
    (error) => {
      console.error('Failed to listen to reviews:', error);
    }
  );

  return () => unsubscribe();
}, []);


  const addReview = async (review: Review) => {
    try {
      await addDoc(collection(db, 'reviews'), review);
      // Pas besoin de mettre à jour localement, onSnapshot fera ça automatiquement
    } catch (error) {
      console.error('Failed to add review to Firestore:', error);
      throw error;
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview }}>
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
