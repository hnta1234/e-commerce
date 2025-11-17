import React from "react";
import { motion } from "framer-motion";

export default function QuickView({ product, close }) {
  return (
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
          onClick={close}
        >
          ×
        </button>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h2 className="text-xl font-bold mt-4">{product.name}</h2>
        <p className="text-gray-500 mt-1">{product.category}</p>
        <p className="mt-2 font-bold">
          £{product.discount_price || product.price}
        </p>
      </motion.div>
    </motion.div>
  );
}
