import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroVideo from "../../assets/hero-1.mp4"; // adjust path

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white"
        >
          New Winter Collection 2025
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-2xl text-gray-200 mt-4 max-w-2xl"
        >
          Discover premium styles, comfort, and modern design.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 flex gap-4"
        >
          <Link to="/shop">
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
              Shop Now
            </button>
          </Link>

          <Link to="/shop">
            <button className="px-6 py-3 border border-white text-white rounded-full hover:bg-white/20 transition">
              Explore Deals
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
