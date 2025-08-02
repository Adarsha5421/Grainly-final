import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaShoppingCart,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../context/UserContext";

export default function Navbar() {
  const { user, logout, loading } = useContext(UserContext);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef();
  const navigate = useNavigate();
  const [navbarSearch, setNavbarSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavbarSearch = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    if (navbarSearch.trim()) {
      navigate(`/allproducts?search=${encodeURIComponent(navbarSearch.trim())}`);
    } else {
      navigate("/allproducts");
    }
  };

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 bg-[#fff8e1] border-b border-[#f2c94c] shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center h-[100px]">
        {/* Logo and Nav */}
        <div className="flex items-center gap-20 flex-grow">
          <Link
            to="/"
            className="text-4xl font-extrabold text-[#9b3f3f] tracking-wide uppercase whitespace-nowrap"
          >
            GRAINLY<span className="text-[#f2c94c]">.</span>
          </Link>
          <nav className="hidden md:flex gap-12 text-[17px] font-semibold text-[#4a2e2e]">
            <Link to="/" className="hover:text-[#f2c94c] transition">Home</Link>
            <Link to="/allproducts" className="hover:text-[#f2c94c] transition">Products</Link>
            <Link to="/about" className="hover:text-[#f2c94c] transition">About</Link>
            <Link to="/contact" className="hover:text-[#f2c94c] transition">Contact</Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              className="text-[#9b3f3f] hover:text-[#f2c94c] transition"
              onClick={() => setSearchOpen((prev) => !prev)}
              title="Search"
            >
              <FaSearch size={20} />
            </button>
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleNavbarSearch}
                  className="absolute right-0 mt-3 bg-white border border-[#f2c94c] rounded-lg shadow-lg w-64 px-4 py-3 z-50 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Search dals..."
                    value={navbarSearch}
                    onChange={(e) => setNavbarSearch(e.target.value)}
                    className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700"
                    autoFocus
                  />
                  <button type="submit" className="text-[#9b3f3f] hover:text-[#f2c94c]">
                    <FaSearch />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Buttons */}
          {user ? (
            <div className="flex gap-3 items-center">
              <Link to="/cart" className="text-[#4a2e2e] hover:text-[#f2c94c]" title="Cart">
                <FaShoppingCart size={22} />
              </Link>
              <Link
                to="/my-orders"
                className="flex items-center gap-1 text-[#4a2e2e] font-medium hover:text-[#f2c94c] transition"
              >
                <FaClipboardList size={16} />
                Orders
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-1 text-[#4a2e2e] font-medium hover:text-[#f2c94c] transition"
              >
                <FaUserCircle size={16} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 font-medium hover:text-red-800 transition"
              >
                <FaSignOutAlt size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-[#9b3f3f] text-[#9b3f3f] hover:bg-[#9b3f3f] hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full border border-[#f2c94c] text-[#f2c94c] hover:bg-[#f2c94c] hover:text-white transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
