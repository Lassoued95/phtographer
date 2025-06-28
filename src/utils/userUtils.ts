// User identification utility for review ownership
export const getUserId = (): string => {
  let userId = localStorage.getItem('reviewUserId');
  
  if (!userId) {
    // Generate a unique user ID for this browser session
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('reviewUserId', userId);
  }
  
  return userId;
};

export const isReviewOwner = (reviewUserId?: string): boolean => {
  if (!reviewUserId) return false;
  return getUserId() === reviewUserId;
};

export const clearUserSession = (): void => {
  localStorage.removeItem('reviewUserId');
};