import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getpulsesById } from "../../api/api";
import { useCart } from "../../context/CartContext";

const weights = [100, 250, 500, 1000];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(100);

  useEffect(() => {
    getpulsesById(id)
      .then(setProduct)
      .catch(() => toast.error("Product not found"));
  }, [id]);

  if (!product) return <div className="text-center py-20 text-gray-400">Loading product...</div>;

  const totalPrice = Number(((product.pricePerGram || 1) * weight).toFixed(2));
  const imageSrc = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "http://localhost:5000/uploads/placeholder.jpg";

  const handleBuyNow = () => {
    addToCart({
      id: product._id,
      title: product.name,
      pricePerGram: product.pricePerGram,
      weight,
      totalPrice,
      image: imageSrc,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
    navigate("/cart");
  };

  return (
    <div className="bg-[#f7f7f5] min-h-screen py-12 px-6 md:px-20 font-sans text-[#1a1a1a]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
        {/* Image + label */}
        <div className="relative bg-white rounded-3xl p-6 shadow-xl overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full max-h-[450px] object-contain transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-5 left-5 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
            GRAINLY PICK
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight">{product.name}</h1>

          {/* Weight Buttons */}
          <div>
            <h3 className="text-sm font-medium mb-2">Select Weight</h3>
            <div className="flex flex-wrap gap-3">
              {weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(w)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    weight === w
                      ? "bg-[#2b3c29] text-white scale-105"
                      : "bg-white text-[#2b3c29] border-[#2b3c29] hover:bg-[#2b3c29] hover:text-white"
                  }`}
                >
                  {w === 1000 ? "1kg" : `${w}g`}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Stock */}
          <div>
            <p className="text-3xl font-bold">Rs {totalPrice}</p>
            <p className={`text-sm mt-1 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          {/* Product Info Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoTile title="Shelf Life" value="6 Months" />
            <InfoTile title="Packaging" value="Resealable Pouch" />
            <InfoTile title="Certified" value="100% Organic" />
            <InfoTile title="Origin" value="Himalayan Region" />
          </div>

          {/* Buttons: Stacked */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button
              onClick={() => {
                addToCart({
                  id: product._id,
                  title: product.name,
                  pricePerGram: product.pricePerGram,
                  weight,
                  totalPrice,
                  image: imageSrc,
                  stock: product.stock,
                });
                toast.success(`${product.name} added to cart!`);
              }}
              className="w-full bg-[#2b3c29] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1a261a] transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full border border-[#2b3c29] text-[#2b3c29] py-3 rounded-lg text-sm font-semibold hover:bg-[#2b3c29] hover:text-white transition"
            >
              Buy Now
            </button>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Product Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            {product.bulletPoints?.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                {product.bulletPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Nutrition Highlights */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold mb-6 text-center">Nutrition Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Nutrient label="Protein" value="12g/100g" />
          <Nutrient label="Carbohydrate" value="60g/100g" />
          <Nutrient label="Fat" value="2.5g/100g" />
          <Nutrient label="Fiber" value="8g/100g" />
        </div>
      </div>
    </div>
  );
}

function InfoTile({ title, value }) {
  return (
    <div className="bg-white shadow-sm p-4 rounded-xl border border-gray-200 text-center">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  );
}

function Nutrient({ label, value }) {
  return (
    <div className="bg-[#fff] rounded-xl p-5 border border-gray-200 shadow text-center">
      <h3 className="text-sm text-gray-600 font-medium">{label}</h3>
      <p className="text-lg font-semibold text-[#1a1a1a] mt-1">{value}</p>
    </div>
  );
}
