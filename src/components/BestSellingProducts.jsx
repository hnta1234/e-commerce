import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BestSellingProducts() {
  const [products, setProducts] = useState(null); // null = loading

  useEffect(() => {
    async function fetchBestSellers() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("best_seller", true)
        .order("id", { ascending: true });

      if (error) console.log("Supabase error:", error);
      else setProducts(data);
    }

    fetchBestSellers();
  }, []);

  // ----------------------------
  // ⭐ SKELETON SHIMMER LOADING
  // ----------------------------
  if (products === null) {
    return (
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Best Selling Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-300 rounded-xl h-64 w-full"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------
  // ⭐ REAL PRODUCT CARDS
  // ----------------------------
  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Best Selling Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* ⭐ BEST SELLER BADGE */}
            {product.best_seller && (
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                Best Seller
              </div>
            )}

            <Link to={`/shop?category=${product.category.toLowerCase()}`}>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-3 text-center bg-white">
                <p className="font-semibold">{product.name}</p>
                <p className="text-md text-green-600 font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
