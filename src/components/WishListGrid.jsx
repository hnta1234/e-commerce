import React, { useState, useEffect } from "react";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WishListGrid = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

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

  if (!wishlistItems.length)
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="relative bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
        >
          {/* Heart icon to remove */}
          <button
            onClick={() => removeFromWishlist(item.id)}
            className="absolute top-2 right-2 text-red-500 text-xl hover:scale-110 transition"
          >
            <FaHeart />
          </button>

          {/* Product image */}
          <img
            src={item.image_url || "/placeholder.png"}
            alt={item.name}
            className="w-full h-40 object-cover rounded cursor-pointer"
            onClick={() => navigate(`/product/${item.id}`)}
          />

          {/* Product name */}
          <h2
            className="mt-2 text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            {item.name || "Product Name"}
          </h2>

          {/* Product price */}
          <p className="text-gray-700 mt-1">
            £{item.discount_price || item.price || "0.00"}
          </p>

          {/* Rating stars */}
          <div className="flex mt-2">
            {Array.from({ length: 5 }).map((_, i) =>
              i < (item.rating || 0) ? (
                <FaStar key={i} className="text-yellow-400" />
              ) : (
                <FaRegStar key={i} className="text-gray-300" />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishListGrid;
