import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/UseWishList";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    setProduct(data);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate("/cart");
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const productImages = [product.image_url];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Badges */}
            <div className="flex gap-2">
              {product.is_new && (
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  New Arrival
                </span>
              )}
              {product.discount && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.0)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                £{product.price}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-500 line-through">
                  £{product.original_price}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description ||
                  "This premium product combines style, comfort, and quality craftsmanship. Perfect for everyday use or special occasions."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWishlistToggle}
                className={`p-4 rounded-xl border-2 transition-colors flex items-center justify-center ${
                  isInWishlist(product.id)
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                }`}
              >
                <Heart
                  size={20}
                  className={isInWishlist(product.id) ? "fill-current" : ""}
                />
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">SKU:</span>
                  <span className="text-gray-600 ml-2">#{product.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Category:</span>
                  <span className="text-gray-600 ml-2">
                    {product.category || "General"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Stock:</span>
                  <span className="text-green-600 ml-2">In Stock</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Shipping:</span>
                  <span className="text-gray-600 ml-2">Free</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
