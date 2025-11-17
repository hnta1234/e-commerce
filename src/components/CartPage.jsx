import React, { useState } from "react";
import { supabase } from "../supabase-client";

export default function Checkout({ cart, closeCheckout, onOrderSuccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + (item.discount_price || item.price) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return setError("Email is required");
    if (cart.length === 0) return setError("Cart is empty");

    setLoading(true);
    setError("");

    // Insert into Supabase
    const { data, error } = await supabase.from("orders").insert([
      {
        user_email: email,
        items: cart,
        total: total,
      },
    ]);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      onOrderSuccess(); // Clear cart in parent
      alert("Order placed successfully!");
      closeCheckout();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 font-bold text-lg"
          onClick={closeCheckout}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            Email
            <input
              type="email"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Optional: Address */}
          <label className="flex flex-col">
            Address
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Optional"
            />
          </label>

          <p className="font-bold">Total: £{total.toFixed(2)}</p>

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
