import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabase-client";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import Navbar from "../components/ui/layout/Navbar";

import DealPromoBanner from "../components/DealPromoBanner";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "../components/Footer";
import FlashSaleCountdown from "../components/FlashSaleCountdown";
import { useCart } from "../context/CartContext";
export default function Shop() {
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlistItems(JSON.parse(stored));
    }
  }, []);

  const addToWishlist = (product) => {
    const newItems = [...wishlistItems, product];
    setWishlistItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));
  };

  const removeFromWishlist = (productId) => {
    const newItems = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(newItems);
    localStorage.setItem("wishlist", JSON.stringify(newItems));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortOption, setSortOption] = useState("");
  const [view, setView] = useState("grid");
  const [columns, setColumns] = useState(4);

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  const observer = useRef();

  // ------------------------------
  // Fetch Products Safely
  // ------------------------------
  const fetchProducts = async (reset = false) => {
    try {
      let query = supabase.from("products").select("*");

      // Category filter
      if (selectedCategories.length > 0)
        query = query.in("category", selectedCategories);

      // Price filter
      query = query.gte("price", minPrice).lte("price", maxPrice);

      // Sorting
      switch (sortOption) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "price-low":
          query = query.order("price", { ascending: true });
          break;
        case "price-high":
          query = query.order("price", { ascending: false });
          break;
        default:
          query = query.order("id", { ascending: false });
      }

      // Pagination
      query = query.range((page - 1) * limit, page * limit - 1);

      const { data, error } = await query;
      if (error) throw error;

      if (reset) setProducts(data);
      else setProducts((prev) => [...prev, ...data]);

      setHasMore(data.length >= limit);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  // ------------------------------
  // Fetch Deal Product
  // ------------------------------
  const [dealProduct, setDealProduct] = useState(null);

  const fetchDealProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_deal", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      setDealProduct(data[0] || null);
    } catch (err) {
      console.error("Error fetching deal product:", err.message);
    }
  };

  // ------------------------------
  // Effects
  // ------------------------------
  useEffect(() => {
    fetchProducts(true);
    fetchDealProduct();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(true);
  }, [selectedCategories, minPrice, maxPrice, sortOption]);

  useEffect(() => {
    if (page > 1) fetchProducts();
  }, [page]);

  // ------------------------------
  // Infinite Scroll
  // ------------------------------
  const lastProductRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) setPage((prev) => prev + 1);
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // ------------------------------
  // Cart functions
  // ------------------------------
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  // ------------------------------
  // Wishlist functions
  // ------------------------------
  const handleWishlist = async (product) => {
    if (isInWishlist(product.id)) await removeFromWishlist(product.id);
    else await addToWishlist(product);
  };

  // Quick view
  const handleQuickView = (product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const handleRate = (productId, rating) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, rating } : p))
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + (item.discount_price || item.price) * item.quantity,
    0
  );

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Navbar />

      <div className="flex flex-col md:flex-row gap-6 p-4">
        <Filters
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        <div className="flex-1">
          {dealProduct && <DealPromoBanner product={dealProduct} />}

          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-4">
            <div>
              <label className="font-medium mr-2">Sort by:</label>
              <select
                className="p-2 border rounded"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">View:</span>
              <button
                className={`p-2 border rounded ${
                  view === "grid" ? "bg-gray-200" : ""
                }`}
                onClick={() => setView("grid")}
              >
                Grid
              </button>
              <button
                className={`p-2 border rounded ${
                  view === "list" ? "bg-gray-200" : ""
                }`}
                onClick={() => setView("list")}
              >
                List
              </button>
              {view === "grid" && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Columns:</span>
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      className={`p-2 border rounded ${
                        columns === num ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setColumns(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ProductGrid
            products={products}
            view={view}
            columns={columns}
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
            wishlist={wishlistItems.map((item) => item.id)}
            onQuickView={handleQuickView}
            onRate={handleRate}
            lastProductRef={lastProductRef}
          />
        </div>
      </div>

      {/* Quick View */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-white p-6 rounded-lg w-11/12 max-w-lg relative"
            >
              <button
                className="absolute top-2 right-2 text-gray-600 font-bold text-lg"
                onClick={closeQuickView}
              >
                ×
              </button>
              <img
                src={quickViewProduct.image_url}
                alt={quickViewProduct.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h2 className="text-xl font-bold mt-4">
                {quickViewProduct.name}
              </h2>
              <p className="text-gray-500 mt-1">{quickViewProduct.category}</p>
              <p className="mt-2 font-bold">
                £{quickViewProduct.discount_price || quickViewProduct.price}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {dealProduct && <FlashSaleCountdown saleId={dealProduct.id} />}
      <Footer />
    </div>
  );
}
