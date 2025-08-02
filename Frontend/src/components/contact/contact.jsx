import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../../api/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      toast.success("Thank you! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "What types of lentils do you sell?",
      answer: "We offer Masoor, Moong, Rajma, Chana, and more — all lab-tested and sourced locally.",
    },
    {
      question: "How fast is delivery?",
      answer: "We deliver across Nepal within 24–48 hours depending on your location.",
    },
    {
      question: "Where is your warehouse?",
      answer: "Our main facility is in Kapan, Kathmandu — Dot Trade building.",
    },
    {
      question: "Is there a minimum order?",
      answer: "Yes, the minimum order is NPR 300 to qualify for delivery.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f3] px-4 sm:px-6 py-16 text-[#3e2f1c] font-['Nunito']">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8 space-y-6 border border-[#ebdfd1]">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-[#b0413e] mb-1">Get in Touch</h1>
            <p className="text-sm text-[#5a4d3b]">
              We'd love to hear from you — be it queries, collaborations, or feedback.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="E.g. Ramesh Thapa"
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#b0413e] outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#b0413e] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+977-98XXXXXXX"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#b0413e] outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Your Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Tell us what’s on your mind..."
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#b0413e] outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#91c788] hover:bg-[#7bb36d] text-white font-semibold py-2 rounded-md transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* FAQ Panel */}
        <div className="bg-white border border-[#ebdfd1] shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-[#3e2f1c] mb-2">📦 Common Questions</h2>
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-3">
              <button
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                className="w-full text-left flex justify-between items-center text-[#5a4d3b] font-medium"
              >
                {faq.question}
                <span className="text-xl">{openFAQ === idx ? "−" : "+"}</span>
              </button>
              {openFAQ === idx && (
                <p className="mt-2 text-sm text-gray-700 bg-[#f3f0eb] p-3 rounded-md">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}

          {/* Static Info */}
          <div className="mt-6 pt-4 border-t border-dashed border-[#ccc] space-y-1 text-sm">
            <p><strong>📧 Email:</strong> hello@grainly.com</p>
            <p><strong>📞 Phone:</strong> 9800000000</p>
            <p><strong>📍 Warehouse:</strong>Chitwan, Nepal</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      
    </div>
  );
}
