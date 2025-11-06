import { useContext, useEffect } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { LiaTimesSolid } from "react-icons/lia";
import { CartContext } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router";
import { FcRefresh } from "react-icons/fc";
import { ToastContainer } from "react-toastify";
import { FavoriteContext } from "../contexts/FavoritesContext";

interface productsProps {
  category: string;
  description: string;
  id: number;
  images: string[];
  name: string;
  price: string;
  size: string;
  stock: number;
  brand: string;
  category_name: string;
  brand_name: string;
  color: string;
  quantity: number;
}

const CartPage = () => {
  const {
    cart,
    increment,
    decrement,
    removeFromCart,
    loading,
    errorMessage,
    fetchCart,
  } = useContext(CartContext);
  const { favorites, addToFavorites, removeFromFavorites } =
    useContext(FavoriteContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const priceAndQuantity = cart.map(
    (item: productsProps) => Number(item.price) * item.quantity
  );
  const Subtotal = priceAndQuantity.reduce(
    (acc: number, value: number) => acc + value,
    0
  );

  const Shipping = 0;
  const total = Shipping + Subtotal;

  return (
    <section className="min-h-screen bg-gray-50">
      <ToastContainer autoClose={1000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 sm:items-center mb-6 sm:mb-8">
          <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">
            SHOPPING BAG ({cart.length})
          </h1>

          <Link
            to={"/favorites"}
            className="flex w-fit cursor-pointer items-center gap-2 text-gray-600 hover:text-violet-500 transition-colors text-sm sm:text-base"
          >
            <BsHeart className="text-lg" />
            <span>FAVORITES</span>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2">
            {/* Loading */}
            {loading && !errorMessage && (
              <div className="h-96 flex items-center justify-center flex-col gap-3 bg-white rounded-lg shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                <p className="text-gray-600 mt-2">Loading your cart...</p>
              </div>
            )}

            {errorMessage && (
              <div className="h-96 flex items-center justify-center flex-col gap-3 bg-white rounded-lg shadow-sm">
                <p className="text-red-500">{errorMessage}</p>
                <FcRefresh
                  className="text-3xl cursor-pointer hover:scale-110 transition-transform"
                  onClick={fetchCart}
                />
              </div>
            )}

            {!errorMessage && !loading && cart.length < 1 && (
              <div className="h-96 flex items-center justify-center flex-col gap-4 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 text-lg">
                  No items in shopping bag
                </p>
                <Link
                  to={"/products"}
                  className="font-bold bg-violet-500 hover:bg-violet-600 text-white px-8 sm:px-14 py-2 sm:py-3 rounded transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            )}

            {/* Cart Items Grid */}
            {!errorMessage && !loading && cart.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {cart.map((cartItem: productsProps) => {
                    const inFavorites = favorites.find(
                      (item: productsProps) => item.id === cartItem.id
                    );
                    return (
                      <div key={cartItem.id} className="relative">
                        <div className="flex gap-3 sm:gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="border border-gray-300 relative group">
                              <img
                                className="w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-60 object-cover"
                                src={cartItem.images[0]}
                                alt={cartItem.name}
                              />
                              <div className="absolute right-2 bottom-2 bg-white p-1.5 rounded shadow-sm">
                                {inFavorites ? (
                                  <BsHeartFill
                                    onClick={() =>
                                      removeFromFavorites(cartItem.id)
                                    }
                                    className="cursor-pointer text-violet-500 text-lg hover:scale-110 transition-transform"
                                  />
                                ) : (
                                  <BsHeart
                                    onClick={() => addToFavorites(cartItem)}
                                    className="cursor-pointer text-lg hover:text-violet-500 hover:scale-110 transition-all"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Product Info - Mobile */}
                            <div className="mt-2 sm:hidden">
                              <p className="text-xs text-gray-500 font-medium">
                                {cartItem.category_name}
                              </p>
                              <h2 className="font-semibold text-sm line-clamp-1">
                                {cartItem.name}
                              </h2>
                              <p className="font-semibold text-violet-900 mt-1">
                                ${cartItem.price}
                              </p>
                            </div>
                          </div>

                          {/* Product Details & Controls */}
                          <div className="flex-1 flex flex-col justify-between">
                            {/* Product Info - Desktop */}
                            <div className="hidden sm:block">
                              <p className="text-xs text-gray-500 font-medium mb-1">
                                {cartItem.category_name}
                              </p>
                              <h2 className="font-semibold text-sm md:text-base line-clamp-2">
                                {cartItem.name}
                              </h2>
                              <p className="font-semibold text-violet-900 mt-2">
                                ${cartItem.price}
                              </p>
                            </div>

                            {/* Size, Color, Quantity */}
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  Size
                                </span>
                                <p className="font-semibold text-sm">
                                  {cartItem.size}
                                </p>
                              </div>

                              <div className="flex flex-col items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  Color
                                </span>
                                <div
                                  style={{ backgroundColor: cartItem.color }}
                                  className="h-6 w-6 border border-gray-400 rounded"
                                />
                              </div>

                              <div className="flex flex-col items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  Qty
                                </span>
                                <div className="flex flex-col w-8">
                                  <button
                                    onClick={() =>
                                      increment(
                                        cartItem.id,
                                        cartItem.quantity + 1
                                      )
                                    }
                                    className="text-center cursor-pointer font-semibold border border-gray-300 hover:bg-gray-100 transition-colors rounded-t"
                                  >
                                    +
                                  </button>
                                  <div className="text-center border-x border-gray-300 py-1 text-sm">
                                    {cartItem.quantity}
                                  </div>
                                  <button
                                    onClick={() =>
                                      decrement(
                                        cartItem.id,
                                        cartItem.quantity - 1
                                      )
                                    }
                                    className="text-center cursor-pointer font-semibold border border-gray-300 hover:bg-gray-100 transition-colors rounded-b"
                                  >
                                    -
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            className="absolute top-0 right-0 text-gray-600 hover:text-red-500 cursor-pointer bg-gray-100 hover:bg-red-50 h-8 w-8 flex items-center justify-center rounded transition-colors"
                            onClick={() => removeFromCart(cartItem.id)}
                          >
                            <LiaTimesSolid className="text-lg" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6 sticky top-6">
                <h2 className="font-bold text-lg sm:text-xl mb-4">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium ">${Subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {Shipping === 0 ? "Free" : 0}
                    </span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg">
                          TOTAL
                        </h3>
                        <span className="text-xs text-gray-500">
                          (TAX INCL.)
                        </span>
                      </div>
                      <h3 className="font-bold text-xl sm:text-2xl text-violet-900">
                        ${total.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full cursor-pointer bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white py-3 rounded font-bold transition-colors"
                >
                  CONTINUE TO CHECKOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CartPage;
