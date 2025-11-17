import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) console.log("Supabase error:", error);
      else setCategories(data);
    }
    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return <p className="text-center py-12">Loading categories...</p>;
  }

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-12 text-center">
        Featured Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <Link key={cat.id} to={`/shop?category=${cat.name.toLowerCase()}`}>
            <motion.div
              className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 15px 30px rgba(0,0,0,0.3)",
              }}
            >
              {/* Image */}
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-60 md:h-48 object-cover transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm flex items-end justify-center"
                initial={{ y: 50, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <span className="text-white text-xl font-semibold mb-4">
                  {cat.name}
                </span>
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
