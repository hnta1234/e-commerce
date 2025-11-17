import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // -------------------------------
  // 1️⃣ Listen for login / logout
  // -------------------------------
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // -------------------------------
  // 2️⃣ Load cart when user logs in or from localStorage if not logged in
  // -------------------------------
  useEffect(() => {
    if (user) {
      loadCartFromSupabase();
    } else {
      loadCartFromLocalStorage();
    }
  }, [user]);

  const loadCartFromSupabase = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_cart")
      .select("id, product_id, quantity, products(*)") // fetch product details
      .eq("user_id", user.id);

    if (!error) {
      const formatted = data.map((row) => ({
        id: row.product_id,
        quantity: row.quantity,
        ...row.products, // name, price, image_url, etc.
      }));
      setCartItems(formatted);
    }

    setLoading(false);
  };

  const loadCartFromLocalStorage = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("cart");
      const items = stored ? JSON.parse(stored) : [];
      setCartItems(items);
    } catch (err) {
      console.error("Error loading cart from localStorage:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToLocalStorage = (items) => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  };

  // -------------------------------
  // 3️⃣ Add to Cart
  // -------------------------------
  const addToCart = async (product) => {
    if (user) {
      // Logged in: use Supabase
      const { error } = await supabase.from("user_cart").upsert({
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      });

      if (!error) {
        loadCartFromSupabase();
      }
    } else {
      // Not logged in: use localStorage
      const existingItem = cartItems.find((item) => item.id === product.id);
      let newItems;

      if (existingItem) {
        newItems = cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...cartItems, { ...product, quantity: 1 }];
      }

      setCartItems(newItems);
      saveCartToLocalStorage(newItems);
    }
  };

  // -------------------------------
  // 4️⃣ Update Quantity
  // -------------------------------
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    if (user) {
      // Logged in: use Supabase
      const { error } = await supabase
        .from("user_cart")
        .update({ quantity })
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (!error) {
        loadCartFromSupabase();
      }
    } else {
      // Not logged in: use localStorage
      const newItems = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      setCartItems(newItems);
      saveCartToLocalStorage(newItems);
    }
  };

  // -------------------------------
  // 5️⃣ Remove From Cart
  // -------------------------------
  const removeFromCart = async (productId) => {
    if (user) {
      // Logged in: use Supabase
      const { error } = await supabase
        .from("user_cart")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (!error) {
        loadCartFromSupabase();
      }
    } else {
      // Not logged in: use localStorage
      const newItems = cartItems.filter((item) => item.id !== productId);
      setCartItems(newItems);
      saveCartToLocalStorage(newItems);
    }
  };

  // -------------------------------
  // 6️⃣ Clear entire cart
  // -------------------------------
  const clearCart = async () => {
    if (user) {
      // Logged in: use Supabase
      const { error } = await supabase
        .from("user_cart")
        .delete()
        .eq("user_id", user.id);

      if (!error) {
        setCartItems([]);
      }
    } else {
      // Not logged in: use localStorage
      setCartItems([]);
      saveCartToLocalStorage([]);
    }
  };

  const cartCount = cartItems.reduce((t, item) => t + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        user,
        cartItems,
        loading,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        reloadCart: loadCartFromSupabase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
