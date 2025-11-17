import React from "react";

export default function CartSidebar({
  cart,
  onRemove,
  onQuantityChange,
  total,
  openCheckout,
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        cart.length > 0 ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-lg">Your Cart ({cart.length})</h2>
      </div>
      <div className="p-4 flex flex-col gap-4 overflow-y-auto h-full">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 border-b pb-2"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500 text-sm">
                    £{item.discount_price || item.price}
                  </p>
                  <div className="flex items-center mt-1 gap-2">
                    <button
                      className="border px-2 rounded"
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="border px-2 rounded"
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="mt-4 border-t pt-4">
              <p className="font-bold text-lg">Total: £{total.toFixed(2)}</p>
              <button
                onClick={openCheckout}
                className="w-full mt-2 bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
