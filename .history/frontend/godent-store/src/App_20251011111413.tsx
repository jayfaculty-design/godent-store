import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./contexts/CartContext";
import Favorites from "./pages/Favorites";
import { FavoriteProvider } from "./contexts/FavoritesContext";
import ProfilePage from "./pages/ProfilePage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ScrollToTop from "./components/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccessPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

function App() {
  return (
    <div className="h-screen font-ysabeau">
      <AuthProvider>
        <CartProvider>
          <FavoriteProvider>
            <BrowserRouter>
              <Navbar />
              <ScrollToTop />
              <Routes>
                <Route path="/" index element={<Index />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoutes>
                      <CartPage />
                    </ProtectedRoutes>
                  }
                />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoutes>
                      <Favorites />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoutes>
                      <ProfilePage />
                    </ProtectedRoutes>
                  }
                />
                <Route path="/auth/sign-up" element={<SignUp />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route
                  path="/order-details/:orderId"
                  element={<OrderDetailsPage />}
                />
                <Route path="/payment-success" element={<PaymentSuccess />} />
              </Routes>
            </BrowserRouter>
          </FavoriteProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
