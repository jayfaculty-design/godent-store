import { useContext, useEffect, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { GrRefresh } from "react-icons/gr";
import { useParams } from "react-router";
import { CartContext } from "../contexts/CartContext";
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
}

const ProductDetails = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { cart, removeFromCart, addToCart } = useContext(CartContext);
  const { addToFavorites, favorites, removeFromFavorites } =
    useContext(FavoriteContext);
  const url = `http://localhost:3000/products/${id}`;

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`Error fetching data`);
      }
      const data = await response.json();
      setProducts(data);
      console.log(data);
      setErrorMessage("");
      setLoading(false);
    } catch (error) {
      console.log("Error in fetching data", error);
      setErrorMessage("Error getting products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const myTransition = `ease-in-out duration-300 transition-all`;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer autoClose={1000} />

      {/* Loading & Error States */}
      {(loading || errorMessage) && (
        <div className="flex items-center justify-center h-screen">
          {loading && (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
              <p className="text-gray-600">Loading product...</p>
            </div>
          )}
          {errorMessage && (
            <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-lg shadow-sm">
              <p className="text-red-500">No data found</p>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <GrRefresh className="cursor-pointer" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Details */}
      {products.map((product: productsProps) => {
        const inCart = cart.find(
          (item: productsProps) => item.id === product.id
        );
        const inFavorites = favorites.find(
          (item: productsProps) => item.id === product.id
        );

        return (
          <div key={product.id}>
            {/* Desktop Layout */}
            <div className="hidden lg:block pt-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
                  {/* Image Gallery - Desktop */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={product.images[activeImage]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                            activeImage === index
                              ? "border-violet-500 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Info - Desktop */}
                  <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 h-fit sticky top-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                          {product.category_name}
                        </p>
                        <h1 className="font-bold text-2xl xl:text-3xl mb-2">
                          {product.name}
                        </h1>
                        <p className="text-gray-600 text-sm font-medium">
                          MRP incl. of all taxes
                        </p>
                      </div>

                      {/* Favorite & Price */}
                      <div className="flex flex-col items-end gap-2">
                        {inFavorites ? (
                          <button
                            onClick={() => removeFromFavorites(product.id)}
                            className="bg-gray-200 hover:bg-gray-300 p-2.5 rounded-full transition-all"
                            aria-label="Remove from favorites"
                          >
                            <BsHeartFill className="text-lg text-violet-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => addToFavorites(product)}
                            className="bg-gray-200 hover:bg-gray-300 p-2.5 rounded-full transition-all"
                            aria-label="Add to favorites"
                          >
                            <BsHeart className="text-lg" />
                          </button>
                        )}
                        <p className="font-bold text-2xl text-violet-900">
                          ${product.price}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Size */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3">Size</h2>
                      <button className="border-2 border-gray-400 px-6 py-2 font-bold rounded hover:border-violet-500 hover:bg-violet-50 transition-all">
                        {product.size}
                      </button>
                    </div>

                    {/* Stock Info */}
                    {product.stock > 0 ? (
                      <p className="text-sm text-green-600 font-medium mb-4">
                        In Stock ({product.stock} available)
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 font-medium mb-4">
                        Out of Stock
                      </p>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        inCart
                          ? removeFromCart(product.id)
                          : addToCart(product);
                      }}
                      disabled={product.stock === 0}
                      className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                        product.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : inCart
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-violet-500 hover:bg-violet-600"
                      }`}
                    >
                      {product.stock === 0
                        ? "OUT OF STOCK"
                        : inCart
                        ? "✓ ADDED TO CART"
                        : "ADD TO CART"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              {/* Main Image - Fixed Background */}
              <div className="fixed inset-0 bg-white">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Sheet */}
              <div
                className={`fixed left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl ${myTransition} ${
                  showDetails ? "bottom-0" : "-bottom-[85vh]"
                }`}
              >
                {/* Handle */}
                <div className="flex items-center justify-center py-4 border-b">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 rounded-full bg-violet-400 hover:bg-violet-500 text-white transition-colors"
                    aria-label="Close details"
                  >
                    <BiChevronDown className="text-2xl" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-5 pb-24 max-h-[80vh] overflow-y-auto">
                  {/* Image Thumbnails */}
                  <div className="grid grid-cols-4 gap-2 py-4">
                    {product.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === index
                            ? "border-violet-500"
                            : "border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Product Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {product.category_name}
                      </p>
                      <h1 className="font-bold text-lg mb-1">{product.name}</h1>
                      <p className="text-gray-600 text-xs font-medium">
                        MRP incl. of all taxes
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {inFavorites ? (
                        <button
                          onClick={() => removeFromFavorites(product.id)}
                          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-all"
                          aria-label="Remove from favorites"
                        >
                          <BsHeartFill className="text-sm text-violet-500" />
                        </button>
                      ) : (
                        <button
                          onClick={() => addToFavorites(product)}
                          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-all"
                          aria-label="Add to favorites"
                        >
                          <BsHeart className="text-sm" />
                        </button>
                      )}
                      <p className="font-bold text-xl text-violet-900">
                        ${product.price}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Size */}
                  <div className="mb-4">
                    <h2 className="text-base font-semibold mb-2">Size</h2>
                    <button className="border-2 border-gray-400 px-4 py-1.5 font-bold rounded">
                      {product.size}
                    </button>
                  </div>

                  {/* Stock Info */}
                  {product.stock > 0 ? (
                    <p className="text-sm text-green-600 font-medium mb-4">
                      In Stock ({product.stock} available)
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-medium mb-4">
                      Out of Stock
                    </p>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      inCart ? removeFromCart(product.id) : addToCart(product);
                    }}
                    disabled={product.stock === 0}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                      product.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : inCart
                        ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                        : "bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
                    }`}
                  >
                    {product.stock === 0
                      ? "OUT OF STOCK"
                      : inCart
                      ? "✓ ADDED TO CART"
                      : "ADD TO CART"}
                  </button>
                </div>
              </div>

              {/* Toggle Button - Mobile */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 hover:bg-gray-800 text-white py-4 flex items-center justify-center transition-all shadow-2xl"
                aria-label="Show product details"
              >
                <BiChevronUp className="text-3xl animate-bounce bg-white rounded-full text-gray-900" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductDetails;
