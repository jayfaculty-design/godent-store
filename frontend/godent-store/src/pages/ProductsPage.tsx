import { useContext, useEffect, useState } from "react";
import { CgChevronRight } from "react-icons/cg";
import { GrRefresh } from "react-icons/gr";
import { useNavigate } from "react-router";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../contexts/CartContext";
import { IoCheckmarkCircle } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import { LuFilter } from "react-icons/lu";
import { BiSearchAlt2 } from "react-icons/bi";

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

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { cart, removeFromCart, addToCart, fetchCart, userId } =
    useContext(CartContext);

  const url = "http://localhost:3000/products";
  const url_2 = "http://localhost:3000/categories";
  const url_3 = "http://localhost:3000/brands";

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
      setErrorMessage("");
      setLoading(false);
    } catch (error) {
      console.log("Error in fetching data", error);
      setErrorMessage("Error getting products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(url_2);
      if (!response.ok) {
        console.log("No categories found");
      }
      setCategories(await response.json());
    } catch (err) {
      console.log("Error getting categories", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(url_3);
      if (!response.ok) {
        console.log("No brands found");
      }
      setBrands(await response.json());
    } catch (err) {
      console.log("Error getting categories", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchBrands();
    fetchCart();
  }, [url, url_2, url_3, userId]);

  const newCat = categories.map(
    (categorie: { category_name: string }) => categorie.category_name
  );
  const newBrands = brands.map(
    (brand: { brand_name: string }) => brand.brand_name
  );

  const handleIndexChange = (id: number) => {
    setActiveIndex((prev) => (prev === id ? prev : id));
  };

  const handleFilterSelect = (categoryName: string, index: number) => {
    handleIndexChange(index);
    setActiveCategory(categoryName);
    setShowFilters(false);
  };

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product: productsProps) =>
            product.category_name === activeCategory ||
            product.brand_name === activeCategory
        );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer autoClose={1000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb & Page Title */}
        <div className="flex justify-center flex-col items-center mb-6 sm:mb-8">
          <div className="flex gap-2 text-sm sm:text-base mb-2">
            <button
              className="text-gray-600 hover:text-violet-500 transition-colors"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <p className="font-semibold text-gray-900">Products</p>
          </div>
          <h1 className="font-bold uppercase text-2xl sm:text-3xl md:text-4xl text-gray-900">
            Products
          </h1>
        </div>

        {/* Filters Section */}
        <div className="mb-6 sm:mb-8">
          {/* Filter Toggle Button - Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 font-semibold text-lg mb-4 text-gray-900 hover:text-violet-500 transition-colors"
          >
            <LuFilter className="text-xl" />
            <span>Filters</span>
            <CgChevronRight
              className={`text-sm transition-transform ${
                showFilters ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Filter Pills - Desktop Always Visible, Mobile Toggleable */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block bg-white rounded-lg shadow-sm p-4 sm:p-6`}
          >
            <div className="flex items-center gap-2 mb-4 lg:mb-0 lg:hidden">
              <LuFilter className="text-gray-600" />
              <h2 className="font-semibold text-gray-900">Filter by:</h2>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {["All", ...newCat, ...newBrands].map((categoryName, index) => (
                <button
                  onClick={() => handleFilterSelect(categoryName, index)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                    activeIndex === index
                      ? "bg-violet-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                  key={index}
                >
                  {categoryName}
                </button>
              ))}
            </div>

            {/* Active Filter Info */}
            {activeCategory !== "All" && (
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing:{" "}
                  <strong className="text-violet-600">{activeCategory}</strong>
                </span>
                <button
                  onClick={() => handleFilterSelect("All", 0)}
                  className="text-violet-500 hover:text-violet-600 font-medium"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg shadow-sm">
              <p className="text-red-500">No data found</p>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <GrRefresh className="cursor-pointer" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !errorMessage && (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm sm:text-base text-gray-600">
              <p>
                Showing{" "}
                <strong className="text-gray-900">
                  {filteredProducts.length}
                </strong>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
                {activeCategory !== "All" && ` in ${activeCategory}`}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                {filteredProducts
                  .map((product: productsProps) => {
                    const inCart = cart.find(
                      (item: { id: number }) => item.id === product.id
                    );
                    return (
                      <ProductCard
                        desktopCartText={inCart ? "-" : "+"}
                        index={product.id}
                        bgColor={`${
                          inCart ? "bg-green-500/60" : "bg-violet-500"
                        }`}
                        inCartIcon={inCart && <IoCheckmarkCircle />}
                        clickAction={() =>
                          inCart
                            ? removeFromCart(product.id)
                            : addToCart(product)
                        }
                        cartText={`${inCart ? "added to cart" : "add to cart"}`}
                        name={product.name}
                        image_url={product.images[0]}
                        price={product.price}
                        category={product.category_name}
                        key={product.id}
                        productLink={`${product.id}`}
                      />
                    );
                  })
                  .reverse()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
                <div className="text-gray-400 text-6xl mb-4">
                  <BiSearchAlt2 />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                <button
                  onClick={() => handleFilterSelect("All", 0)}
                  className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors"
                >
                  View All Products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
