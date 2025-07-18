
import React, { useState, useEffect } from 'react';
import axios from '../../config/axiosConfig';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/admin/payments');
        setPayments(res.data);
      } catch (err) {
        toast.error('Failed to load payments');
        console.error(err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border-b">User</th>
              <th className="p-3 border-b">Worker</th>
              <th className="p-3 border-b">Amount</th>
              <th className="p-3 border-b">Currency</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.userId?.fullName ?? 'N/A'}</td>
                <td className="p-3">{p.workerId?.fullName ?? 'N/A'}</td>
                <td className="p-3">${p.amount?.toFixed(2) ?? '0.00'}</td>
                <td className="p-3">{p.currency?.toUpperCase() ?? 'USD'}</td>
                <td className="p-3 text-green-600 font-medium">Paid</td>
                <td className="p-3">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
