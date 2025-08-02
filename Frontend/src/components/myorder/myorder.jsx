// MyOrder.jsx – unique layout design with static summary section and decorative elements
import React, { useState, useEffect } from "react";
import { getUserBookings } from "../../api/api";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    setLoading(true);
    getUserBookings()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unable to fetch orders.");
        setLoading(false);
      });
  }, []);

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModal(true);
    setCancelReason("");
  };

  const confirmCancel = () => {
    setOrders((prev) => prev.filter((order) => order._id !== selectedOrderId));
    setCancelModal(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f4f7f2] to-[#e8f0e2] px-6 py-10 text-[#1a1e1c] relative">
      <div className="absolute top-10 right-10 bg-white shadow-lg rounded-xl px-6 py-4 w-fit hidden md:block">
        <h4 className="text-md font-bold text-[#264733] mb-1">Order Tips</h4>
        <ul className="text-sm text-gray-600 list-disc ml-4">
          <li>Orders marked Delivered cannot be cancelled.</li>
          <li>Cancellation is only available while Pending.</li>
          <li>Keep your contact number updated.</li>
        </ul>
      </div>

      <h2 className="text-4xl font-bold text-center text-[#264733] mb-12 tracking-tight">Your Orders</h2>

      {loading ? (
        <div className="text-center text-lg py-20 text-[#556f57]">Loading your orders...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-20">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-16">You have not placed any orders yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {orders.map((order) => {
            const imgSrc = order.pulses?.image
              ? `http://localhost:5000/uploads/${order.pulses.image}`
              : "http://localhost:5000/uploads/placeholder.jpg";

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition p-5 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={imgSrc}
                    alt={order.pulses?.name}
                    onError={(e) => (e.target.src = "http://localhost:5000/uploads/placeholder.jpg")}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-[#2f3b2e]">{order.pulses?.name}</h3>
                    <p className="text-xs text-gray-400">#{order._id.slice(-6)}</p>
                  </div>
                </div>

                <div className="text-sm text-[#264733] space-y-1 mb-4">
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Total:</strong> Rs {order.totalPrice}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p className="text-[#5d6d7e]"><strong>Address:</strong> {order.address}</p>
                </div>

                <div className="mt-auto">
                  {order.status === "pending" ? (
                    <button
                      onClick={() => openCancelModal(order._id)}
                      className="w-full text-sm bg-[#264733] text-white py-2 rounded hover:bg-[#1f3223]"
                    >
                      Cancel Order
                    </button>
                  ) : order.status === "delivered" ? (
                    <div className="text-green-700 font-medium text-center">Delivered ✓</div>
                  ) : order.status === "shipped" ? (
                    <div className="text-blue-600 font-medium text-center">Shipped 🚚</div>
                  ) : order.status === "cancelled" ? (
                    <div className="text-red-600 font-medium text-center">Cancelled ✖</div>
                  ) : (
                    <div className="text-yellow-600 font-medium text-center">Processing…</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#3a506b]">Cancel Order</h3>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option value="">-- Choose a reason --</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancelReason}
                className={`px-4 py-2 text-sm text-white rounded transition duration-200 ${
                  cancelReason
                    ? "bg-[#3a506b] hover:bg-[#1f3223]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyOrder;
