// src/components/NewArrivals.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // ✅ useNavigate inside function component

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12); // fetch latest 12 items

    if (!error) setProducts(data);
  };

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">🆕 New Arrivals</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white p-4 rounded-2xl shadow-md border"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260 }}
          >
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-60 object-cover rounded-xl"
              />

              {/* 🆕 New Arrival Badge */}
              {product.is_new && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 text-xs rounded-lg shadow"
                >
                  New Arrival
                </motion.span>
              )}
            </div>

            <h3 className="mt-4 font-semibold text-lg">{product.name}</h3>

            <p className="text-gray-700 mb-3">£{product.price}</p>

            {/* ✅ Functional View Details Button */}
            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-900 relative z-10"
            >
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
