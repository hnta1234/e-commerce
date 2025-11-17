import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

export default function DealPromoBanner() {
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    const fetchPromo = async () => {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .order("created_at", { ascending: false }) // latest promo first
        .limit(1)
        .single();

      if (!error && data) {
        setPromo(data);
      } else {
        console.log("No promo found or error:", error);
        setPromo(null);
      }
    };

    fetchPromo();
  }, []);

  return (
    <div className="bg-yellow-100 border border-yellow-300 p-4 rounded mb-4 flex items-center justify-center text-center font-medium text-gray-800">
      {promo ? (
        <>
          <span className="mr-2">🎉 Promo:</span>
          <span className="font-semibold">{promo.title}</span>
          {promo.description && (
            <span className="ml-2">— {promo.description}</span>
          )}
        </>
      ) : (
        <>
          <span className="mr-2">🎉 Promo:</span>
          <span className="font-semibold">
            Free Shipping on Orders Over £50
          </span>
        </>
      )}
    </div>
  );
}
