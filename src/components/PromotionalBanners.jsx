import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";

export default function DealPromoBanner() {
  const [dealProduct, setDealProduct] = useState(null);

  const fetchDealProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_deal", true) // Only products marked as deal
      .order("created_at", { ascending: false })
      .limit(1); // Take the latest deal

    if (!error && data.length > 0) setDealProduct(data[0]);
    else setDealProduct(null);
  };

  useEffect(() => {
    fetchDealProduct();
  }, []);

  if (!dealProduct) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-4 px-4 bg-yellow-100 text-yellow-800 p-3 rounded-md text-center flex flex-col sm:flex-row justify-between items-center gap-4"
    >
      <div className="font-semibold">
        🎉 Deal of the Day: {dealProduct.name}
      </div>
      <div className="text-sm">
        Only £{dealProduct.discount_price || dealProduct.price} today!
      </div>
      <a
        href={`/product/${dealProduct.id}`}
        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
      >
        Shop Now
      </a>
    </motion.div>
  );
}
