// contexts/ReviewContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

interface Review {
  id?: string;
  name: string;
  location?: string;
  text: string;
  rating: number;
  imageUrl?: string;
  createdAt?: any;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'imageUrl'> & { image?: File | null }) => Promise<void>;
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
            imageUrl: data.imageUrl || '',
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

  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'imageUrl'> & { image?: File | null }) => {
    try {
      console.log('Adding review with image:', !!review.image);
      
      let imageUrl = '';
      
      // CRITICAL FIX: Upload image FIRST and wait for completion before creating review
      if (review.image) {
        console.log('Starting image upload...');
        
        // Create a unique filename with timestamp
        const timestamp = Date.now();
        const fileExtension = review.image.name.split('.').pop() || 'jpg';
        const fileName = `review-${timestamp}.${fileExtension}`;
        
        // Upload with metadata for better performance
        const imageRef = ref(storage, `review-images/${fileName}`);
        const metadata = {
          contentType: review.image.type,
          cacheControl: 'public,max-age=31536000', // Cache for 1 year
        };
        
        try {
          console.log('Uploading image to Firebase Storage...');
          const uploadResult = await uploadBytes(imageRef, review.image, metadata);
          imageUrl = await getDownloadURL(uploadResult.ref);
          console.log('Image upload completed successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }
      
      // Only create the review AFTER image upload is complete (or if no image)
      const reviewData = {
        name: review.name || 'Anonymous',
        location: review.location || '',
        text: review.text || '',
        rating: review.rating || 5,
        imageUrl: imageUrl, // This will be the actual URL or empty string
        createdAt: new Date()
      };
      
      console.log('Creating review document with data:', reviewData);
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('Review added successfully with ID:', docRef.id);
      
    } catch (error) {
      console.error('Failed to add review:', error);
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