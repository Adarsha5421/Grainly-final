import React, { useState, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { getAllpulses } from "../../api/api";
import { Link, useLocation, useNavigate } from "react-router-dom";

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useQuery();
  const search = query.get("search") || "";
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    setLoading(true);
    getAllpulses()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.name)))];

  const categoryFiltered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.name === selectedCategory);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return categoryFiltered;
    const term = debouncedSearch.trim().toLowerCase();
    return categoryFiltered.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.keywords && p.keywords.toLowerCase().includes(term))
    );
  }, [categoryFiltered, debouncedSearch]);

  return (
    <div className="bg-[#f5f5f2] text-black px-4 md:px-16 py-10 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-4xl font-extrabold tracking-tight text-center mb-12 text-[#3e3e3e]">
        All Pulses
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 ${
              selectedCategory === cat
                ? "bg-[#4b6043] text-white border-[#4b6043]"
                : "border-[#4b6043] text-[#4b6043] hover:bg-[#4b6043] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-lg">Loading products...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { _id, name, pricePerGram, stock, image } = product;
  const [weight, setWeight] = useState(100);
  const navigate = useNavigate();

  const imgSrc = image
    ? `http://localhost:5000/uploads/${image}`
    : "http://localhost:5000/uploads/placeholder.jpg";
  const price = Math.round(pricePerGram * weight);
  const originalPrice = Math.round(price * 1.05);
  const pricePerGramDisplay = pricePerGram.toFixed(2);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: _id,
      title: `${name} ${weight}g`,
      price,
      image: imgSrc,
      stock,
    });
    toast.success(`${name} (${weight}g) added to cart!`);
  };

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="rounded-2xl overflow-hidden shadow-xl group bg-[#ffffff] hover:shadow-2xl transition-all duration-200 border border-[#e4e4e4] cursor-pointer relative"
    >
      <div className="w-full h-56 bg-[#f7f7f7] flex justify-center items-center overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          className="h-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-[#333] mb-1 truncate">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{weight}g — Rs {price}</p>

        <div className="flex justify-between items-center mb-3">
          <select
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="border border-[#ccc] rounded px-2 py-1 text-sm focus:outline-none"
          >
            <option value={100}>100g</option>
            <option value={250}>250g</option>
            <option value={500}>500g</option>
            <option value={1000}>1kg</option>
          </select>

          <div className="text-right">
            <span className="text-sm line-through text-gray-400 block">
              Rs {originalPrice}
            </span>
            <span className="text-lg font-bold text-[#4b6043]">
              Rs {price}
            </span>
            <div className="text-xs text-gray-500">Rs {pricePerGramDisplay}/g</div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`w-full text-sm py-2 border rounded font-semibold transition-colors duration-200 ${
            stock === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
              : "border-[#4b6043] text-[#4b6043] hover:bg-[#4b6043] hover:text-white"
          }`}
        >
          {stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}
