import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";
import * as Icons from "react-icons/fa";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

const Footer = () => {
  const [sections, setSections] = useState([]);
  const [links, setLinks] = useState([]);
  const [socials, setSocials] = useState([]);
  const [newsletter, setNewsletter] = useState({});
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    const { data: sec } = await supabase.from("footer_sections").select("*");
    const { data: lnk } = await supabase
      .from("footer_links")
      .select("*")
      .order("order", { ascending: true });
    const { data: soc } = await supabase.from("footer_socials").select("*");
    const { data: news } = await supabase.from("footer_newsletter").select("*");

    setSections(sec || []);
    setLinks(lnk || []);
    setSocials(soc || []);
    setNewsletter(news?.[0] || {});
  };

  const groupedLinks = links.reduce((acc, row) => {
    if (!acc[row.section_name]) acc[row.section_name] = [];
    acc[row.section_name].push(row);
    return acc;
  }, {});

  return (
    <footer className="bg-gray-900 text-gray-200 pt-24">
      {/* ------- TOP MEGA GRID (6 BIG COLUMNS) ------- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-16 pb-20 border-b border-gray-700">
        {sections.map((sec, i) => (
          <motion.div
            key={sec.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <h3 className="text-xl font-semibold mb-6">{sec.section_name}</h3>
            <ul className="space-y-4">
              {groupedLinks[sec.section_name]?.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    className="text-gray-400 hover:text-white transition text-lg"
                  >
                    {l.item_name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* ------- MIDDLE ROW: NEWSLETTER + ADDRESS + SOCIALS ------- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-20 py-20 border-b border-gray-700">
        {/* NEWSLETTER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">{newsletter.title}</h2>
          <p className="text-gray-400 mb-6">{newsletter.subtitle}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Subscribed: ${email}`);
              setEmail("");
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              required
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-md text-gray-900 flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-pink-600 px-6 py-3 rounded-md text-white hover:bg-pink-700 transition text-lg">
              Subscribe
            </button>
          </form>
        </motion.div>

        {/* ADDRESS / CONTACT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            YourBrand HQ
            <br />
            221B Baker Street
            <br />
            London, UK
            <br />
            <br />
            Email: support@yourbrand.com
            <br />
            Phone: +44 123 456 789
          </p>
        </motion.div>

        {/* SOCIAL ICONS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6">Follow Us</h2>
          <div className="flex items-center gap-8">
            {socials.map((s) => {
              const Icon = Icons[s.icon_name] || Icons.FaQuestionCircle;
              return (
                <motion.a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  className="text-5xl text-gray-300 hover:text-white transition"
                  whileHover={{ scale: 1.35, rotate: 10 }}
                >
                  <Icon />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ------- PAYMENT METHODS ROW (USING ICONS) ------- */}
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-10 py-12 border-b border-gray-700 text-gray-300 text-5xl">
        <FaCcVisa className="hover:text-white transition" />
        <FaCcMastercard className="hover:text-white transition" />
        <FaCcPaypal className="hover:text-white transition" />
        <FaCcAmex className="hover:text-white transition" />
      </div>

      {/* ------- APP DOWNLOAD + COUNTRY ROW (ICONS) ------- */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-8 py-10 border-b border-gray-700">
        {/* Country Selector */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-lg">🌍 Country:</span>
          <select className="bg-gray-800 text-white p-2 rounded-md">
            <option>United Kingdom</option>
            <option>United States</option>
            <option>India</option>
            <option>Germany</option>
          </select>
        </div>

        {/* App Icons */}
        <div className="flex items-center gap-6 text-4xl">
          <FaGooglePlay className="hover:text-white transition" />
          <FaApple className="hover:text-white transition" />
        </div>
      </div>

      {/* ------- COPYRIGHT ------- */}
      <motion.div
        className="text-center py-10 text-gray-500 text-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        © {new Date().getFullYear()} YourBrand — All Rights Reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
