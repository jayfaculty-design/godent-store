import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { FavoriteContext } from "../contexts/FavoritesContext";
import { FcRefresh } from "react-icons/fc";
import { Link } from "react-router";
import { LiaTimesSolid } from "react-icons/lia";
import { BsCart3 } from "react-icons/bs";
import { CartContext } from "@/contexts/CartContext";

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

const Favorites = () => {
  const {
    favorites,
    loading,
    errorMessage,
    fetchFavorites,
    removeFromFavorites,
  } = useContext(FavoriteContext);
  const { addToCart, removeFromCart, cart } = useContext(CartContext);

  return (
    <section className="min-h-screen bg-gray-50">
      <ToastContainer autoClose={1000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 sm:items-center justify-between mb-6 sm:mb-8">
          <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">
            YOUR WISHLIST ({favorites.length})
          </h1>

          {favorites.length > 0 && (
            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-600 hover:text-violet-500 transition-colors text-sm sm:text-base"
            >
              <BsCart3 className="text-lg" />
              <span>VIEW CART</span>
            </Link>
          )}
        </div>

        {/* Loading State */}
        {loading && !errorMessage && (
          <div className="h-96 flex items-center justify-center flex-col gap-3 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
            <p className="text-gray-600 mt-2">Loading your wishlist...</p>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="h-96 flex items-center justify-center flex-col gap-4 bg-white rounded-lg shadow-sm">
            <p className="text-red-500 text-center px-4">{errorMessage}</p>
            <button
              onClick={fetchFavorites}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FcRefresh className="text-2xl" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!errorMessage && !loading && favorites.length < 1 && (
          <div className="h-96 flex items-center justify-center flex-col gap-4 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 text-6xl mb-2">♡</div>
            <p className="text-gray-600 text-lg">Your wishlist is empty</p>
            <p className="text-gray-500 text-sm mb-2">
              Save your favorite items here
            </p>
            <Link
              to={"/products"}
              className="font-bold bg-violet-500 hover:bg-violet-600 text-white px-8 sm:px-14 py-2 sm:py-3 rounded transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && !errorMessage && favorites.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {favorites.map((favorite: productsProps) => {
                const inCart = cart.find(
                  (cartItem: productsProps) => cartItem.id === favorite.id
                );
                return (
                  <div
                    key={favorite.id}
                    className="group relative bg-white rounded-lg overflow-hidden"
                  >
                    {/* Remove Button */}
                    <button
                      className="absolute top-2 right-2 z-10 text-gray-600 hover:text-red-500 cursor-pointer bg-white hover:bg-red-50 h-8 w-8 flex items-center justify-center rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                      onClick={() => removeFromFavorites(favorite.id)}
                      aria-label="Remove from favorites"
                    >
                      <LiaTimesSolid className="text-lg" />
                    </button>

                    {/* Product Image */}
                    <Link
                      to={`/products/${favorite.id}`}
                      className="block relative overflow-hidden"
                    >
                      <div className="aspect-[3/4] bg-gray-100">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={favorite.images[0]}
                          alt={favorite.name}
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4">
                      <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">
                        {favorite.category_name}
                      </p>
                      <Link to={`/products/${favorite.id}`}>
                        <h2 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-violet-500 transition-colors min-h-[2.5rem] sm:min-h-[3rem]">
                          {favorite.name}
                        </h2>
                      </Link>
                      <p className="font-bold text-violet-900 mt-2 text-sm sm:text-base">
                        ${favorite.price}
                      </p>

                      {inCart ? (
                        <button
                          onClick={() => removeFromCart(favorite.id)}
                          className="w-full cursor-pointer mt-3 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          Added to Cart
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(favorite)}
                          className="w-full mt-3 cursor-pointer bg-violet-500 hover:bg-violet-600 text-white py-2 rounded text-sm font-medium transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Info */}
        {!loading && !errorMessage && favorites.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {favorites.length} {favorites.length === 1 ? "item" : "items"} in
              your wishlist
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorites;
