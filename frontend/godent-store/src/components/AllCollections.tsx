import { useContext, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { BiChevronDown } from "react-icons/bi";
import { Link } from "react-router";
import { GrRefresh } from "react-icons/gr";
import { CartContext } from "../contexts/CartContext";
import { IoCheckmarkCircle } from "react-icons/io5";

interface productsProps {
  category: string;
  description: string;
  id: number;
  images: string[];
  name: string;
  price: string;
  size: string;
  stock: number;
  brand: number;
  category_name: string;
  brand_name: string;
}

const AllCollections = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const { cart, removeFromCart, addToCart } = useContext(CartContext);

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
        console.log(`Error fetching brands`);
      }
      setBrands(await response.json());
    } catch (error) {
      console.log(`Error fetching brands`, error);
    }
  };

  const newCat = categories.map(
    (categorie: { category_name: string }) => categorie.category_name
  );

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchBrands();
  }, [url, url_2]);

  return (
    <div className="px-5 py-5">
      <div className="pb-16">
        <h1 className="font-beatrice-extrabold uppercase text-4xl lg:text-5xl relative">
          xiv <br /> collections <br /> 25-26
        </h1>
      </div>

      <div className="flex items-center justify-center">
        {loading && !errorMessage && (
          <div className="h-96 flex items-center justify-center flex-col gap-3 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
            <p className="text-gray-600 mt-2">Loading products...</p>
          </div>
        )}
        {errorMessage && (
          <div className="flex items-center gap-2">
            <p>No data found</p>
            <GrRefresh className="cursor-pointer" onClick={fetchData} />
          </div>
        )}
      </div>

      <div>
        {products.length > 1 && (
          <div className="flex flex-col gap-1 md:flex-row md:gap-5">
            {["All", ...newCat].map((product, index) => (
              <p
                role="button"
                onClick={() => {
                  setActiveCategory(product);
                }}
                className={`${
                  activeCategory === product
                    ? "font-bold uppercase text-violet-900"
                    : "text-gray-500 font-medium"
                } cursor-pointer w-fit md:text-lg`}
                key={index}
              >
                {product}
              </p>
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 gap-y-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-y-10">
          {activeCategory === "All"
            ? products
                .filter((item: productsProps) => item.brand_name === "xiv")
                .map((product: productsProps) => {
                  const inCart = cart.find(
                    (item: { id: number }) => item.id === product.id
                  );
                  return (
                    <ProductCard
                      index={product.id}
                      bgColor={`${
                        inCart ? "bg-green-500/60" : "bg-violet-500"
                      }`}
                      inCartIcon={inCart && <IoCheckmarkCircle />}
                      desktopCartText={inCart ? "-" : "+"}
                      clickAction={() =>
                        inCart ? removeFromCart(product.id) : addToCart(product)
                      }
                      cartText={`${inCart ? "added to cart" : "add to cart"}`}
                      category={product.category_name}
                      name={product.name}
                      price={product.price}
                      image_url={product.images[0]}
                      productLink={`/products/${product.id}`}
                    />
                  );
                })
            : products
                .filter(
                  (product: productsProps) =>
                    product.category_name === activeCategory
                )
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
                        inCart ? removeFromCart(product.id) : addToCart(product)
                      }
                      cartText={`${inCart ? "added to cart" : "add to cart"}`}
                      category={product.category_name}
                      name={product.name}
                      price={product.price}
                      image_url={product.images[0]}
                      productLink={`/products/${product.id}`}
                    />
                  );
                })}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        {products.length > 1 && (
          <Link
            to={`${
              activeCategory === "All"
                ? "/products"
                : activeCategory === "Shoes"
                ? "/products/shoes"
                : activeCategory === "Hoodies"
                ? "/products/hoodies"
                : "/products/shirts"
            }`}
            className=" text-gray-700 flex flex-col items-center w-fit"
          >
            More <BiChevronDown className="font-bold text-black" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default AllCollections;
