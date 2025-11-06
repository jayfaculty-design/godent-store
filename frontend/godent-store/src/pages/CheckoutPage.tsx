import { useState, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { CartContext } from "@/contexts/CartContext";
import { toast, ToastContainer } from "react-toastify";

const stripePromise = loadStripe(
  "pk_test_51SGgJaBNGiWr4bKpBWGQTi33lSraoi8Sve9xgvEZOTtJOlp0OSUryLgDFHQ7v8wn9mb4JxH3lEiOVIzrzYPygwMw00w01ar791"
);

export default function CheckoutPage() {
  const { cart } = useContext(CartContext);
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
  });
  const [showPayment, setShowPayment] = useState(false);

  const getTotal = () => {
    return cart.reduce(
      (total: number, item: { price: number; quantity: number }) =>
        total + item.price * item.quantity,
      0
    );
  };

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/orders/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            cartItems: cart,
          }),
        }
      );

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setShowPayment(true);
      toast.success("Order created successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create order");
    }
  };

  const appearance: { theme: "stripe" } = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer autoClose={1000} />
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {!showPayment ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <form onSubmit={handleSubmitInfo}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                {cart.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Order #{orderId}</p>
              <p className="text-2xl font-bold">${getTotal().toFixed(2)}</p>
            </div>
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm orderId={orderId} />
              </Elements>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
