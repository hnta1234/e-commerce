import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const WishlistHeader = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlistItems(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="w-full bg-white shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Back arrow */}
        <button
          onClick={() => navigate("/shop")}
          className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
        >
          <FaArrowLeft className="text-xl" />
        </button>

        {/* Title and count */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Your Wishlist
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {`${wishlistItems.length} product${
              wishlistItems.length !== 1 ? "s" : ""
            } saved for later`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WishlistHeader;
