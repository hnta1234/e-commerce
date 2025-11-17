// Filters.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

export default function Filters({
  selectedCategories,
  setSelectedCategories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("products").select("category");
      if (data) {
        const unique = [...new Set(data.map((p) => p.category))];
        setCategories(unique);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="w-full md:w-1/4 p-4 border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <p className="text-sm text-gray-600">Min: £{minPrice}</p>
        <input
          type="range"
          min="0"
          max="500"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm text-gray-600 mt-2">Max: £{maxPrice}</p>
        <input
          type="range"
          min="0"
          max="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
