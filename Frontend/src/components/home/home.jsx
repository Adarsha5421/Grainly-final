import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import Hero from "../Hero/Hero";
import { getAllpulses } from "../../api/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllpulses()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#fefefc] text-black">
      <Hero />
      <PromoBanner />
      <div className="px-6 md:px-16 py-14">
        <ProductSection
          title="Best Sellers"
          products={products.slice(0, 4)}
          loading={loading}
          error={error}
        />
      </div>
      <FeaturedInfo />
      <div className="h-12" />
    </div>
  );
}

function PromoBanner() {
  return (
    <section className="bg-[#e2dfd6] mt-[-20px] py-10 px-6 md:px-16 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-3">From Farm to Fork</h2>
      <p className="max-w-2xl mx-auto text-gray-700 text-lg">
        Sustainably harvested pulses, packed with nutrition. Grainly delivers purity and purpose in every serving.
      </p>
    </section>
  );
}

function FeaturedInfo() {
  return (
    <section className="bg-[#f9f8f4] px-6 md:px-16 py-14">
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div>
          <h3 className="text-lg font-semibold mb-2">🌿 100% Natural</h3>
          <p className="text-gray-700 text-sm">
            No additives or chemicals. Just clean, dry pulses handpicked by farmers.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">📦 Airtight Packaging</h3>
          <p className="text-gray-700 text-sm">
            Packed to preserve freshness and prolong shelf life with minimal environmental impact.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">💪 Protein Rich</h3>
          <p className="text-gray-700 text-sm">
            A powerhouse of nutrition for every Nepalese household — healthy, affordable, and tasty.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProductSection({ title, products, loading, error }) {
  return (
    <section className="bg-white">
      <div className="flex justify-center mb-10">
        <div className="border border-[#4b6043] rounded-xl px-6 py-3 shadow-sm bg-[#f4f7f2]">
          <h2 className="text-center text-2xl md:text-3xl font-bold tracking-wide text-[#4b6043]">
            {title}
          </h2>
        </div>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
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
      className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md cursor-pointer transition"
      onClick={handleCardClick}
    >
      <img
        src={imgSrc}
        alt={name}
        className="w-full h-52 object-cover group-hover:scale-105 transition"
      />
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold mb-2 text-[#333]">{name}</h3>
        <div className="flex justify-between items-center mb-3 text-sm">
          <div>
            <label className="text-gray-500">Weight</label>
            <select
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="ml-2 text-sm border border-gray-300 px-2 py-0.5 rounded"
            >
              <option value={100}>100g</option>
              <option value={250}>250g</option>
              <option value={500}>500g</option>
              <option value={1000}>1kg</option>
            </select>
          </div>
          <div className="text-right">
            <span className="block line-through text-gray-400">Rs {originalPrice}</span>
            <span className="text-lg font-bold text-[#1f1f1f]">Rs {price}</span>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="w-full text-sm py-2 border border-[#4b6043] text-[#4b6043] rounded hover:bg-[#4b6043] hover:text-white transition-colors duration-200"
        >
          {stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}
