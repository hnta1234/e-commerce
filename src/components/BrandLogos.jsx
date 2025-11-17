import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

export default function BrandLogos() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data, error } = await supabase.from("brands").select("*");

    if (error) {
      console.error("Error:", error);
      return;
    }

    setBrands(data);
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
        Our Partner Brands
      </h2>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {brands.map((brand) => (
          <img
            key={brand.id}
            src={brand.logo_url}
            alt={brand.name}
            style={{
              width: "120px",
              height: "60px",
              objectFit: "contain",
              opacity: 0.9,
              transition: "0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
          />
        ))}
      </div>
    </div>
  );
}
