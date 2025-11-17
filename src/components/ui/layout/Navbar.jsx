import { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Heart,
  Search,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  // CLOSE MOBILE MENU ON ROUTE CHANGE
  useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  const handleSearch = (searchValue = search) => {
    const query = searchValue.trim();
    if (!query) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
    setSearch("");
    setMobileSearch("");
  };

  const handleKeyPress = (e, searchValue) => {
    if (e.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            ShopNow
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
              }
            >
              Contact
            </NavLink>
          </nav>
        </div>

        {/* MIDDLE SECTION - SEARCH */}
        <div className="hidden md:flex flex-1 justify-center mx-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, search)}
              placeholder="Search for products..."
              className="w-full border rounded-full py-2 pl-4 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSearch(search)}
              className="absolute right-3 top-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5">
          <Link
            to="/wishlist"
            className="hidden md:block text-gray-700 hover:text-blue-600"
          >
            <Heart />
          </Link>

          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <button
              onClick={logout}
              className="hidden md:flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <User />
              <span>Account</span>
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden bg-white shadow-lg border-t overflow-hidden transition-all duration-300 ${
          mobileMenu ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-4 space-y-3">
          {/* Mobile Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, mobileSearch)}
              placeholder="Search for products..."
              className="w-full border rounded-full py-2 pl-4 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSearch(mobileSearch)}
              className="absolute right-3 top-2 text-gray-600 hover:text-blue-500"
            >
              <Search size={20} />
            </button>
          </div>

          <NavLink
            to="/"
            onClick={() => setMobileMenu(false)}
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            onClick={() => setMobileMenu(false)}
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setMobileMenu(false)}
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Contact
          </NavLink>

          <hr className="my-2" />

          {user ? (
            <button
              onClick={() => {
                logout();
                setMobileMenu(false);
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <User size={20} />
              <span>Account</span>
            </Link>
          )}
          <Link
            to="/wishlist"
            onClick={() => setMobileMenu(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenu(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 relative"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
