import React, { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";

const ProductCard = forwardRef(
  (
    { product, view, onAddToCart, onWishlist, wishlist, onQuickView, onRate },
    ref
  ) => {
    const [hovered, setHovered] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [localRating, setLocalRating] = useState(product.rating || 0);

    const isWishlisted = wishlist.includes(product.id); // check if in wishlist

    const handleStarClick = (star) => {
      setLocalRating(star);
      onRate(product.id, star);
    };

    return (
      <motion.div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`bg-white rounded-xl shadow p-4 relative ${
          view === "list" ? "flex items-center gap-4" : ""
        }`}
      >
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 capitalize">
            {product.badge}
          </span>
        )}

        {/* Image */}
        <img
          src={
            hovered && product.hover_image_url
              ? product.hover_image_url
              : product.image_url
          }
          alt={product.name}
          className={`rounded-lg object-cover ${
            view === "grid" ? "w-full h-52" : "w-32 h-32"
          }`}
        />

        <div className={`${view === "list" ? "flex-1" : "mt-3"}`}>
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-gray-500 text-sm">{product.category}</p>

          <div className="mt-2">
            {product.discount_price ? (
              <>
                <span className="line-through text-gray-400 mr-2">
                  £{product.price}
                </span>
                <span className="text-red-600 font-bold">
                  £{product.discount_price}
                </span>
              </>
            ) : (
              <span className="font-bold text-gray-800">£{product.price}</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center mt-1 text-yellow-400 cursor-pointer">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={
                  i < localRating ? "text-yellow-400" : "text-gray-300"
                }
                onClick={() => handleStarClick(i + 1)}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-3 relative">
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded transition hover:bg-gray-100`}
            >
              <FaShoppingCart /> Add to Cart
            </button>

            {/* Wishlist Heart */}
            <button
              type="button"
              onClick={() => onWishlist(product)}
              className={`p-2 border rounded transition ${
                isWishlisted
                  ? "text-red-500 bg-red-50"
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              <FaHeart className={isWishlisted ? "fill-current" : ""} />
            </button>

            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="p-2 border rounded hover:bg-gray-100 transition"
            >
              <FaEye />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);

export default ProductCard;
