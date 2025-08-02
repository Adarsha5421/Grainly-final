// Cart.jsx — Grainly Theme Final Redesign
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProfile } from "../../api/api";
import toast from "react-hot-toast";
import Payment from "../Payment/Payment";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "../../utils/esewaSignature";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("Kathmandu");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const esewaFormRef = useRef(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setStreetAddress(data.address?.split(",")[0] || "");
        setCity(data.address?.split(",")[1] || "");
        setDistrict(data.address?.split(",")[2] || "Kathmandu");
        setPhone(data.phone || "");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch profile info");
      });
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.totalPrice || 0) * Number(item.quantity || 1),
    0
  );
  const shipping = cartItems.length > 0 ? 20 : 0;
  const total = subtotal + shipping;

  const handlePaymentSuccess = () => {
    setShowModal(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const districtOptions = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Biratnagar", "Butwal", "Dharan"];

  return (
    <div className="bg-[#f4f7f2] min-h-screen py-10 px-4 md:px-10 text-[#1f1f1f]">
      <h2 className="text-4xl font-bold text-center text-[#264733] mb-12 tracking-tight">Your Cart</h2>

      <div className="space-y-6 max-w-5xl mx-auto">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-10 shadow text-center">
            <p className="text-lg text-gray-500">No items in your cart.</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id + "-" + item.weight}
              className="bg-white flex flex-col sm:flex-row gap-5 items-center border rounded-2xl shadow hover:shadow-md p-5 transition"
            >
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg border" />
              <div className="flex-1 space-y-1 w-full">
                <h3 className="text-lg font-medium text-[#264733]">{item.title}</h3>
                <p className="text-sm text-gray-500">Weight: {item.weight === 1000 ? "1kg" : `${item.weight}g`}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.weight, Math.max(1, item.quantity - 1))}
                      className="border px-2 py-1 rounded hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                      className="border px-2 py-1 rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-[#2d3b2e]">Rs {Number(item.totalPrice || 0) * Number(item.quantity || 1)}</span>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.weight)}
                  className="text-red-500 text-sm hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-16 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h3 className="text-2xl font-semibold text-[#264733]">Checkout</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Street Address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            className="px-4 py-2 border rounded-md bg-gray-50"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2 border rounded-md bg-gray-50"
          />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-2 border rounded-md bg-gray-50"
          >
            {districtOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="px-4 py-2 border rounded-md bg-gray-50"
          />
        </div>

        <div className="bg-[#e8f0e2] p-4 rounded-xl text-sm border">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs {subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Rs {shipping}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-medium">Select Payment Method</h4>
          {['cod', 'khalti', 'esewa'].map(method => (
            <label key={method} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {method === 'cod' && <span className='text-green-700 font-semibold'>Cash on Delivery</span>}
              {method === 'khalti' && <span className='text-purple-600 font-semibold'>Khalti</span>}
              {method === 'esewa' && 'eSewa'}
            </label>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {paymentMethod !== "esewa" && (
          <Payment
            cart={cartItems}
            address={`${streetAddress},${city},${district}`}
            contact={phone}
            paymentMethod={paymentMethod}
            total={total}
            setError={setError}
            setLoading={() => {}}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {paymentMethod === "esewa" && cartItems.length > 0 && (() => {
          const transaction_uuid = uuidv4();
          const { signedFieldNames, signature } = generateEsewaSignature({
            total_amount: total,
            transaction_uuid,
            product_code: "EPAYTEST"
          });

          return (
            <form
              ref={esewaFormRef}
              action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
              method="POST"
              className="mt-2"
            >
              <input type="hidden" name="amount" value={subtotal} />
              <input type="hidden" name="tax_amount" value="0" />
              <input type="hidden" name="total_amount" value={total} />
              <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
              <input type="hidden" name="product_code" value="EPAYTEST" />
              <input type="hidden" name="product_service_charge" value="0" />
              <input type="hidden" name="product_delivery_charge" value={shipping} />
              <input type="hidden" name="success_url" value="http://localhost:5173/paymentsuccess" />
              <input type="hidden" name="failure_url" value="http://localhost:5173/paymentfailure" />
              <input type="hidden" name="signed_field_names" value={signedFieldNames} />
              <input type="hidden" name="signature" value={signature} />
              <button
                type="submit"
                className="w-full bg-[#3d7a4d] hover:bg-[#2f5e3d] text-white font-semibold py-2 rounded-md transition-transform transform hover:scale-[1.02] shadow hover:shadow-md duration-300"
              >
                Pay with eSewa
              </button>
            </form>
          );
        })()}

        <p
          onClick={() => navigate("/")}
          className="text-center text-sm text-gray-500 hover:underline cursor-pointer mt-4"
        >
          ← Continue Shopping
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg w-full max-w-sm">
            <h4 className="text-xl font-semibold text-[#2a2a2a]">Thank you for shopping with Grainly!</h4>
            <p className="text-sm text-gray-600 mt-2">Redirecting to homepage...</p>
            <div className="w-full h-1.5 bg-gray-200 rounded mt-4">
              <div className="h-full bg-[#264733] w-full animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
