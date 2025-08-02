import React from "react";
import { Link } from "react-router-dom";
import { XCircle, AlertTriangle, ArrowLeft, ShoppingCart, Home } from "lucide-react";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Main Error Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
          {/* Header with animated icon */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-center">
            <div className="relative">
              <XCircle className="text-white text-6xl mx-auto mb-4 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertTriangle className="text-red-200 text-2xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-red-100 text-lg">
              We couldn't process your payment at this time
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-red-500 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Transaction Unsuccessful
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Don't worry! Your cart items are still saved and you can try again. 
                If the problem persists, our support team is here to help.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/cart"
                className="block w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Try Again
              </Link>
              
              <Link
                to="/"
                className="block w-full bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <AlertTriangle className="text-blue-600 w-4 h-4" />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Need Help?</p>
                  <p>If the problem persists, please contact our support team. Your cart items are safely saved for your convenience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure payment processing by Grainly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 