import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from "../../assets/grain-sack.svg";

export default function Footer() {
  return (
    <footer className="bg-[#2e1f1b] text-[#f5f2eb] px-4 sm:px-6 lg:px-12 pt-16 pb-8">
      {/* Top Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4">
          <img src={logo} alt="Grainly Logo" className="w-40" />
          <p className="text-sm text-[#cdbba7] leading-relaxed">
            Handpicked lentils, pulses, and beans — fresh from the heartland of Nepal to your kitchen shelves. Pure. Wholesome. Grainly.
          </p>
          <div className="flex gap-4 mt-4 text-xl text-[#cdbba7]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaYoutube /></a>
          </div>
        </div>

        {/* Shop Links */}
        <div className="space-y-2 text-sm">
          <h3 className="uppercase text-[#dabf92] text-xs font-semibold mb-2 tracking-wide">Explore</h3>
          <Link to="/allproducts" className="block hover:text-white">All Products</Link>
          <Link to="/" className="block hover:text-white">Home</Link>
          <Link to="/cart" className="block hover:text-white">Your Basket</Link>
        </div>

        {/* Company Info */}
        <div className="space-y-2 text-sm">
          <h3 className="uppercase text-[#dabf92] text-xs font-semibold mb-2 tracking-wide">Company</h3>
          <Link to="/about" className="block hover:text-white">About Grainly</Link>
          <Link to="/contact" className="block hover:text-white">Contact</Link>
          <Link to="/faq" className="block hover:text-white">FAQs</Link>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4">
          <h3 className="uppercase text-[#dabf92] text-xs font-semibold tracking-wide">Join Our Mail List</h3>
          <p className="text-sm text-[#cdbba7]">
            Get updates on seasonal grains, special deals & healthy recipes.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-2 rounded text-black w-full sm:w-auto outline-none focus:ring-2 focus:ring-[#dabf92]"
            />
            <button
              type="submit"
              className="bg-[#dabf92] text-black px-4 py-2 rounded font-medium hover:bg-[#c5a36c] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="border-t border-[#503d37] mt-12 pt-6 text-center text-xs text-[#a49387] space-y-2">
        <div>© 2024 Grainly. Grown with care. Delivered with trust.</div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/cookie-settings" className="hover:underline">Cookie Settings</Link>
          <Link to="/terms" className="hover:underline">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}
