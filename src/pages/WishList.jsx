import React, { useState, useEffect } from "react";
import WishlistHeader from "../components/WishlistHeader";
import WishlistGrid from "../components/WishlistGrid";

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlistItems(JSON.parse(stored));
    }
  }, []);

  const removeFromWishlist = (productId) => {
    const newItems = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <WishlistHeader />

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <p className="text-gray-500 text-center mt-10">Loading wishlist...</p>
        ) : wishlistItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Your wishlist is empty.
          </p>
        ) : (
          <WishlistGrid />
        )}
      </div>
    </div>
  );
};

export default WishList;
