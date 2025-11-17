import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import Checkout from "../components/Checkout";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.discount_price || item.price) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white p-4 rounded shadow"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p>£{item.discount_price || item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}

          <div className="mt-4 flex justify-between items-center">
            <p className="font-bold text-lg">Total: £{total.toFixed(2)}</p>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <Checkout
          cart={cartItems}
          closeCheckout={() => setIsCheckoutOpen(false)}
          onOrderSuccess={clearCart}
        />
      )}
    </div>
  );
}
