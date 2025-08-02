import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Package, Sparkles, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
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
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="text-green-600 text-4xl animate-bounce" />
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
                Thank you for your purchase! Your order has been successfully placed and you'll receive an email confirmation shortly.
              </p>
            </div>

            {/* Success Details */}
            <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Package className="text-green-600 w-4 h-4" />
                </div>
                <div className="text-sm text-green-800">
                  <p className="font-medium">Order Status: Processing</p>
                  <p className="text-green-600">Estimated delivery: 3-5 business days</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5" />
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/my-orders"
                className="block w-full bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                View My Orders
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <Package className="text-blue-600 w-4 h-4" />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">What's Next?</p>
                  <p>You'll receive an email confirmation with your order details. Our team will process your order and keep you updated on its status.</p>
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

export default PaymentSuccess; 