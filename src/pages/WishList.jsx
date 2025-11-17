import React, { useState, useEffect } from "react";
import WishListHeader from "../components/WishListHeader";
import WishListGrid from "../components/WishListGrid";

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
      <WishListHeader />

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <p className="text-gray-500 text-center mt-10">Loading wishlist...</p>
        ) : wishlistItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Your wishlist is empty.
          </p>
        ) : (
          <WishListGrid />
        )}
      </div>
    </div>
  );
};

export default WishList;
