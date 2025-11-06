import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../contexts/CartContext";
import { IoCheckmarkCircle } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineSearchOff } from "react-icons/md";

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

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const { cart, removeFromCart, addToCart } = useContext(CartContext);

  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      setSearchInput(query);
    }
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const url = `http://localhost:3000/search?q=${encodeURIComponent(
          query
        )}`;
        console.log("fetching", url);
        const response = await fetch(url);

        console.log("Response status: ", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products || []);
        console.log("Data received", data);
      } catch (error) {
        setErrorMessage("Error searching for products");
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchParams({});
    setProducts([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer autoClose={1000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Search Products
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-24 sm:pr-32 text-base sm:text-lg rounded-full border-2 border-gray-300 focus:border-violet-500 focus:outline-none transition-colors shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-violet-500 hover:bg-violet-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                  <BiSearchAlt className="text-lg sm:text-xl" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Search Info */}
          {query && !loading && (
            <div className="mt-4 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                {products.length > 0 ? (
                  <>
                    Found{" "}
                    <strong className="text-gray-900">{products.length}</strong>{" "}
                    {products.length === 1 ? "result" : "results"} for{" "}
                    <strong className="text-violet-600">"{query}"</strong>
                  </>
                ) : (
                  !errorMessage && (
                    <>
                      No results for{" "}
                      <strong className="text-violet-600">"{query}"</strong>
                    </>
                  )
                )}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-sm">
              <MdOutlineSearchOff className="text-6xl text-red-400" />
              <p className="text-red-500 text-lg">{errorMessage}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State - No Query */}
        {!query && !loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
            <BiSearchAlt className="text-7xl sm:text-8xl text-gray-300 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Start Searching
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6 text-center px-4">
              Enter a product name, brand, or category to find what you're
              looking for
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors"
            >
              Browse All Products
            </button>
          </div>
        )}

        {/* No Results State */}
        {!loading && products.length === 0 && query && !errorMessage && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
            <MdOutlineSearchOff className="text-7xl sm:text-8xl text-gray-300 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6 text-center px-4">
              We couldn't find any products matching "<strong>{query}</strong>"
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
              >
                Clear Search
              </button>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors"
              >
                Browse All Products
              </button>
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {products.map((product: productsProps) => {
              const inCart = cart.find(
                (item: { id: number }) => item.id === product.id
              );
              return (
                <ProductCard
                  index={product.id}
                  bgColor={`${inCart ? "bg-green-500/60" : "bg-violet-500"}`}
                  inCartIcon={inCart && <IoCheckmarkCircle />}
                  clickAction={() =>
                    inCart ? removeFromCart(product.id) : addToCart(product)
                  }
                  cartText={`${inCart ? "added to cart" : "add to cart"}`}
                  name={product.name}
                  image_url={product.images[0]}
                  price={product.price}
                  category={product.category_name}
                  key={product.id}
                  productLink={`/products/${product.id}`}
                />
              );
            })}
          </div>
        )}

        {/* Popular Searches / Suggestions (Optional Enhancement) */}
        {!query && !loading && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Popular Searches
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {["Sneakers", "T-Shirts", "Dresses", "Bags", "Watches"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchInput(term);
                      setSearchParams({ q: term });
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
