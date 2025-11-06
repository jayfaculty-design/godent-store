import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router";
import ProductCard from "./ProductCard";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";
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
  brand: string;
  newcollection: boolean;
  category_name: string;
}

const NewCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { cart, removeFromCart, addToCart } = useContext(CartContext);

  const url = "http://localhost:3000/products";

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

  return (
    <div className="px-5 py-5">
      {/* For desktop */}
      <div className="hidden md:flex justify-between mt-10">
        <div className="flex w-full flex-col justify-between">
          <div>
            <h1 className="font-beatrice-extrabold font-extrabold uppercase text-5xl lg:text-5xl">
              New <br /> Collection
            </h1>
            <p className="font-cormorant text-lg">
              Summer <br /> 2025
            </p>
          </div>

          <div className="flex items-center gap-10">
            <Link
              to={"/products"}
              className="bg-[#D9D9D9] font-semibold w-1/2 md:w-1/2 py-2 flex items-center justify-center gap-3"
            >
              Go To Shop <BsArrowRight />
            </Link>

            {/* chevrons */}
            <div className="flex gap-3">
              <div className="border border-gray-400 py-1.5 px-1.5">
                <BiChevronLeft className="text-2xl text-gray-400" />
              </div>
              <div className="border border-gray-400 py-1.5 px-1.5 ">
                <BiChevronRight className="text-2xl" />
              </div>
            </div>
          </div>
        </div>
        {/* images */}
        <div className="w-full">
          <div className="flex items-center justify-center pt-10">
            {loading && !errorMessage && (
              <div className="h-96 flex items-center justify-center flex-col gap-3 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
                <p className="text-gray-600 mt-2">Loading products...</p>
              </div>
            )}
            {errorMessage && (
              <div className="flex items-center gap-2">
                <p>{errorMessage}</p>
                <GrRefresh className="cursor-pointer" onClick={fetchData} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:mr-5 lg:mr-24">
            {!loading &&
              !errorMessage &&
              products.length > 1 &&
              products
                .filter(
                  (item: { newcollection: boolean }) =>
                    item.newcollection === true
                )
                .map((newCollection: productsProps) => {
                  const inCart = cart.find(
                    (item: { id: number }) => item.id === newCollection.id
                  );
                  return (
                    <ProductCard
                      cartText={inCart ? "added to cart" : "add to cart"}
                      clickAction={() =>
                        inCart
                          ? removeFromCart(newCollection.id)
                          : addToCart(newCollection)
                      }
                      desktopCartText={inCart ? "-" : "+"}
                      inCartIcon={inCart && <IoCheckmarkCircle />}
                      index={newCollection.id}
                      bgColor={`${
                        inCart ? "bg-green-500/60" : "bg-violet-500"
                      }`}
                      productLink={`/products/${newCollection.id}`}
                      name={newCollection.name}
                      category={newCollection.category_name}
                      image_url={newCollection.images[0]}
                      key={newCollection.id}
                      price={newCollection.price}
                    />
                  );
                })}
          </div>
        </div>
      </div>

      {/* For mobile */}
      <div className="md:hidden">
        <div className="pb-16">
          <h1 className="font-beatrice-extrabold font-extrabold uppercase text-4xl">
            New <br /> Collection
          </h1>
          <p className="font-cormorant">
            Summer <br /> 2025
          </p>
        </div>

        <div className="flex items-center justify-center">
          {loading && !errorMessage && (
            <div className="h-96 flex items-center justify-center flex-col gap-3 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
              <p className="text-gray-600 mt-2">Loading products...</p>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center gap-2 py-14">
              <p>{errorMessage}</p>
              <GrRefresh className="cursor-pointer" onClick={fetchData} />
            </div>
          )}
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3">
            {!loading &&
              !errorMessage &&
              products.length > 1 &&
              products
                .filter(
                  (item: { newcollection: boolean }) =>
                    item.newcollection === true
                )
                .map((newCollection: productsProps) => {
                  const inCart = cart.find(
                    (item: { id: number }) => item.id === newCollection.id
                  );
                  return (
                    <ProductCard
                      desktopCartText={inCart ? "-" : "+"}
                      cartText={inCart ? "added to cart" : "add to cart"}
                      clickAction={() =>
                        inCart
                          ? removeFromCart(newCollection.id)
                          : addToCart(newCollection)
                      }
                      inCartIcon={inCart && <IoCheckmarkCircle />}
                      index={newCollection.id}
                      bgColor={`${
                        inCart ? "bg-green-500/60" : "bg-violet-500"
                      }`}
                      productLink={`/products/${newCollection.id}`}
                      name={newCollection.name}
                      category={newCollection.category_name}
                      image_url={newCollection.images[0]}
                      key={newCollection.id}
                      price={newCollection.price}
                    />
                  );
                })}
          </div>

          <div className="mt-5">
            <Link
              to={"/products"}
              className="bg-[#D9D9D9] w-1/2 py-2 flex items-center justify-center gap-3"
            >
              Go To Shop <BsArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCollection;
