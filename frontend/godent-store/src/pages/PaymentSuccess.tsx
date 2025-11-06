import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<{ order: { id: string; total_amount: number } } | null>(null);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      fetch(`http://localhost:3000/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrder(data))
        .catch((err) => console.error(err));
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
        {order && (
          <div className="text-left bg-gray-50 p-4 rounded mb-4">
            <p className="text-sm text-gray-600">Order #{order.order.id}</p>
            <p className="font-semibold">Total: ${order.order.total_amount}</p>
          </div>
        )}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
