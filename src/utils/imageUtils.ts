// Ultra-optimized image utility functions for lightning-fast uploads
export const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.6): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Ultra-aggressive compression for sub-3-second uploads
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = Math.floor(img.width * ratio);
      const newHeight = Math.floor(img.height * ratio);
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Fastest rendering settings
      if (ctx) {
        ctx.imageSmoothingEnabled = false; // Faster rendering
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
      }
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality // Lower quality for faster upload
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file' };
  }
  
  // Reduced max size for ultra-fast uploads
  if (file.size > 3 * 1024 * 1024) {
    return { isValid: false, error: 'Image size must be less than 3MB for fast upload' };
  }
  
  return { isValid: true };
};

// Ultra-fast compression for thumbnails
export const createThumbnail = (file: File): Promise<File> => {
  return compressImage(file, 200, 0.5); // Very small for instant upload
};

// Progressive upload: upload thumbnail first, then full image
export const progressiveCompress = (file: File): Promise<{ thumbnail: File; compressed: File }> => {
  return Promise.all([
    createThumbnail(file),
    compressImage(file, 400, 0.6)
  ]).then(([thumbnail, compressed]) => ({ thumbnail, compressed }));
};