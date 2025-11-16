import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  productType?: 'Shilajit' | 'Gemstone';
  image: string;
  price?: number;
  category?: string;
  description?: string;
}

interface LikesContextType {
  likedProducts: Product[];
  isLiked: (productId: string) => boolean;
  toggleLike: (product: Product) => void;
  likeCount: number;
  getProductLikeCount: (productId: string) => number;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

const LIKES_STORAGE_KEY = 'gemstone_likes';
const LIKES_COUNT_STORAGE_KEY = 'gemstone_likes_count';

export const LikesProvider = ({ children }: { children: ReactNode }) => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});

  // Load likes from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem(LIKES_STORAGE_KEY);
    const savedCounts = localStorage.getItem(LIKES_COUNT_STORAGE_KEY);
    
    if (savedLikes) {
      try {
        setLikedProducts(JSON.parse(savedLikes));
      } catch (error) {
        console.error('Error loading likes from localStorage:', error);
      }
    }
    
    if (savedCounts) {
      try {
        setLikesCount(JSON.parse(savedCounts));
      } catch (error) {
        console.error('Error loading likes count from localStorage:', error);
      }
    }
  }, []);

  // Save likes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedProducts));
  }, [likedProducts]);

  // Save likes count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LIKES_COUNT_STORAGE_KEY, JSON.stringify(likesCount));
  }, [likesCount]);

  const isLiked = (productId: string) => {
    return likedProducts.some(
      (item) => (item._id || item.id) === productId
    );
  };

  const toggleLike = (product: Product) => {
    const productId = product._id || product.id || '';
    
    setLikedProducts((prevLikes) => {
      const alreadyLiked = prevLikes.some(
        (item) => (item._id || item.id) === productId
      );

      if (alreadyLiked) {
        // Remove from likes
        const newLikes = prevLikes.filter(
          (item) => (item._id || item.id) !== productId
        );
        // Decrease count
        setLikesCount((prev) => {
          const newCounts = { ...prev };
          const currentCount = newCounts[productId] || 0;
          if (currentCount > 0) {
            newCounts[productId] = currentCount - 1;
          }
          return newCounts;
        });
        return newLikes;
      } else {
        // Add to likes
        const newLikes = [...prevLikes, product];
        // Increase count
        setLikesCount((prev) => {
          const newCounts = { ...prev };
          newCounts[productId] = (newCounts[productId] || 0) + 1;
          return newCounts;
        });
        return newLikes;
      }
    });
  };

  const getProductLikeCount = (productId: string) => {
    return likesCount[productId] || 0;
  };

  return (
    <LikesContext.Provider
      value={{
        likedProducts,
        isLiked,
        toggleLike,
        likeCount: likedProducts.length,
        getProductLikeCount,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};

