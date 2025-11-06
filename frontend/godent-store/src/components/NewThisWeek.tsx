import { useContext, useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { GrRefresh } from "react-icons/gr";
import { Link } from "react-router";
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
  brand: string;
  brand_name: string;
  category_name: string;
}

const NewThisWeek = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [productIndex, setProductIndex] = useState(0);
  const { cart, removeFromCart, addToCart } = useContext(CartContext);
  const url = "http://localhost:3000/products";

  const handleIndexChange = (id: number) => {
    setProductIndex((prev) => (prev === id ? prev : id));
  };
  const fetchData = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log("Error in fetching data");
      }
      const json = await response.json();
      setErrorMessage("");
      setLoading(false);
      setProducts(json);
    } catch (error) {
      console.log(error);
      setErrorMessage("Error in getting products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [url]);
  return (
    <div className="px-5 py-24">
      <div className="pb-16">
        <h1 className="font-beatrice-extrabold uppercase font-extrabold text-4xl lg:text-5xl relative">
          dopeskill <br /> collections{" "}
          <span className="text-sm tracking-[0.1rem] font-extrabold absolute -mt-3 ml-1 text-violet-900">
            (
            {
              products.filter(
                (product: { brand_name: string }) =>
                  product.brand_name === "dopeskill"
              ).length
            }
            )
          </span>
        </h1>
      </div>

      <div className="flex items-center justify-center pt-10">
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

      <div className="grid grid-cols-2 gap-3 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
        {products
          .filter((item: productsProps) => item.brand_name === "dopeskill")
          .map((product: productsProps) => {
            const inCart = cart.find(
              (item: productsProps) => item.id === product.id
            );
            return (
              <div
                onMouseEnter={() => {
                  handleIndexChange(product.id);
                  setShowButton(true);
                }}
                onMouseLeave={() => setShowButton(false)}
                key={product.id}
                className="flex flex-col"
              >
                <div className="w-full border relative border-gray-300">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name.slice(0, 20)}
                    />
                  </Link>
                  {showButton && productIndex === product.id ? (
                    <button className="absolute cursor-pointer right-0 bottom-0 bg-[#D9D9D9]  text-black py-1 px-3">
                      +
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 text-gray-500 text-xs">
                  {product.category_name}
                </p>

                <div className="flex justify-between">
                  <div>
                    <p className="mt-2 font-medium line-clamp-1">
                      {product.name}
                    </p>
                    <button
                      onClick={() => {
                        inCart
                          ? removeFromCart(product.id)
                          : addToCart(product);
                      }}
                      className={`lg:hidden ${
                        inCart ? "bg-green-500/60" : "bg-violet-500"
                      } text-white cursor-pointer flex items-center gap-1 px-5 py-1 mt-2 font-bold`}
                    >
                      {inCart ? "added to cart" : "add to cart"}
                      {inCart && <IoCheckmarkCircle />}
                    </button>
                  </div>
                  <p className="mt-2 font-bold text-violet-900">
                    $ {product.price}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      {/* chevrons */}
      <div className="hidden lg:flex gap-3 mt-7 justify-center">
        {products.length > 1 && (
          <div className="flex items-center gap-2">
            <div className="border border-gray-400 py-1.5 px-1.5">
              <BiChevronLeft className="text-2xl text-gray-400" />
            </div>
            <div className="border border-gray-400 py-1.5 px-1.5 ">
              <BiChevronRight className="text-2xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewThisWeek;
