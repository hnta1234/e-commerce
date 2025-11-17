import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaFacebookF, FaTwitter, FaTimes } from "react-icons/fa";

const InstagramSection = () => {
  const [images, setImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null); // tracks opened image

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("categories")
        .list("", { limit: 20 });

      if (error) throw error;

      const urls = await Promise.all(
        data.map(async (item) => {
          const { publicURL, error: urlError } = supabase.storage
            .from("instagram-images")
            .getPublicUrl(item.name);
          if (urlError) throw urlError;
          return publicURL;
        })
      );

      setImages(urls);
    } catch (error) {
      console.log("Error fetching images:", error.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Follow Us on Instagram
      </h2>

      {/* Instagram Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {images.map((img, index) => (
          <motion.div
            key={index}
            className="overflow-hidden rounded-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={img}
              alt={`Instagram ${index}`}
              className="w-full h-48 object-cover transition-transform duration-300"
            />
          </motion.div>
        ))}
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 mb-8">
        {[
          { icon: <FaInstagram />, url: "https://instagram.com" },
          { icon: <FaFacebookF />, url: "https://facebook.com" },
          { icon: <FaTwitter />, url: "https://twitter.com" },
        ].map((social, idx) => (
          <motion.a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-700 hover:text-pink-500"
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
            >
              <img
                src={images[lightboxIndex]}
                alt={`Instagram Large ${lightboxIndex}`}
                className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              />
              <button
                className="absolute top-2 right-2 text-white text-2xl"
                onClick={() => setLightboxIndex(null)}
              >
                <FaTimes />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default InstagramSection;
