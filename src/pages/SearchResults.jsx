import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/UseWishList";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } =
    useWishlist();

  const handleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      searchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`);

      if (error) {
        setError("Failed to search products");
        console.error(error);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error during search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/shop"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Shop
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Search className="text-gray-400" size={24} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results
              </h1>
              <p className="text-gray-600">
                {query
                  ? `Showing results for "${query}"`
                  : "Enter a search term"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <Link
              to="/shop"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{query}"
            </p>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found {products.length} product
                {products.length !== 1 ? "s" : ""}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="block"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    onWishlist={handleWishlist}
                    wishlist={wishlistItems.map((item) => item.id)}
                    onRate={() => {}}
                  />
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
