import React, { useState } from "react";

export default function BookingPaymentModal({ amount, onClose, onPay }) {
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [ccv, setCcv] = useState("");

  const isEnabled = amount === 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEnabled) return;
    const paymentData = {
      amount, // dollars!
      cardHolderName,
      cardNumber,
      expiryDate,
      ccv,
    };
    onPay(paymentData);
  };

  return (
<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Payment</h2>
        <p className="mb-4">
          Amount to Pay: <strong>${amount}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Holder Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Card Holder Name</label>
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              required
              disabled={!isEnabled}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
              placeholder="John Doe"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              maxLength="16"
              disabled={!isEnabled}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          {/* Expiry + CCV */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                disabled={!isEnabled}
                placeholder="MM/YY"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-medium mb-1">CCV</label>
              <input
                type="text"
                value={ccv}
                onChange={(e) => setCcv(e.target.value)}
                required
                maxLength="4"
                disabled={!isEnabled}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                placeholder="123"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isEnabled}
              className={`px-4 py-2 rounded text-white ${
                isEnabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
