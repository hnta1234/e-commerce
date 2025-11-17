import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist items from localStorage
  const fetchWishlist = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("wishlist");
      const items = stored ? JSON.parse(stored) : [];
      setWishlistItems(items);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add product to wishlist
  const addToWishlist = (product) => {
    const newItems = [...wishlistItems, product];
    setWishlistItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    const newItems = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
