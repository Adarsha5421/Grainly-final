import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Package, Sparkles, ArrowRight, Clock } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Main Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
          {/* Header with animated success icon */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-center relative overflow-hidden">
            {/* Confetti effect */}
            <div className="absolute inset-0">
              <Sparkles className="text-green-200 text-2xl absolute top-4 left-8 animate-pulse" />
              <Sparkles className="text-green-200 text-xl absolute top-8 right-12 animate-pulse delay-300" />
              <Sparkles className="text-green-200 text-lg absolute bottom-4 left-12 animate-pulse delay-500" />
              <Sparkles className="text-green-200 text-xl absolute bottom-8 right-8 animate-pulse delay-700" />
            </div>
            
            <div className="relative z-10">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                <CheckCircle className="text-green-600 text-4xl" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-green-100 text-lg">
                Your order has been confirmed and is being processed
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Order Confirmed
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Thank you for your order! We'll process it and deliver it to you soon.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <Package className="text-green-600 w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">You will receive a confirmation email shortly</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Our team will contact you for delivery details</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Expected delivery: 2-3 business days</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5" />
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate("/myorder")}
                className="w-full bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                View My Orders
              </button>
            </div>

            {/* Auto Redirect Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Clock className="text-blue-600 w-4 h-4" />
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Auto Redirect</p>
                  <p>Redirecting to home page in 5 seconds...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Indicators */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure payment processed by Grainly</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success; 