// src/components/DealSection.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DealSection() {
  const [dealProduct, setDealProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // seconds remaining
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeal = async () => {
      // Try to get a product with is_deal = true
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_deal", true)
        .limit(1)
        .single();

      // If none, fallback to first product
      if (!data) {
        const fallback = await supabase
          .from("products")
          .select("*")
          .limit(1)
          .single();
        data = fallback.data;
      }

      if (data) {
        setDealProduct(data);

        // Set a 24-hour countdown timer
        const dealEnd = new Date();
        dealEnd.setHours(dealEnd.getHours() + 24);
        setTimeLeft(Math.floor((dealEnd - new Date()) / 1000));
      }
    };

    fetchDeal();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}h : ${m
      .toString()
      .padStart(2, "0")}m : ${s.toString().padStart(2, "0")}s`;
  };

  if (!dealProduct) return <p className="text-center py-8">Loading Deal...</p>;

  return (
    <section className="py-12 px-4 bg-yellow-50 rounded-2xl my-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        🔥 Deal of the Day
      </h2>

      <motion.div
        className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 260 }}
      >
        <img
          src={dealProduct.image_url}
          alt={dealProduct.name}
          className="w-full md:w-1/2 h-64 object-cover rounded-xl"
        />

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2">{dealProduct.name}</h3>
            <p className="text-xl text-red-600 font-bold mb-2">
              £{dealProduct.price}
            </p>
            <p className="text-gray-700 mb-4">
              {dealProduct.description || "Limited time deal!"}
            </p>
            <p className="text-gray-800 font-medium">
              ⏰ Ends in: {formatTime(timeLeft)}
            </p>
          </div>

          <button
            onClick={() => navigate(`/product/${dealProduct.id}`)}
            className="mt-4 bg-red-600 text-white py-2 px-6 rounded-xl hover:bg-red-700 w-max"
          >
            View Deal
          </button>
        </div>
      </motion.div>
    </section>
  );
}
