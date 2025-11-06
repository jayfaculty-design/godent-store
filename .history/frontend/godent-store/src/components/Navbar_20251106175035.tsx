import { useContext, useState } from "react";
import { BiHeart } from "react-icons/bi";

import { FiSearch } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { RiUser6Line } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router";
import { CartContext } from "../contexts/CartContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  // const [products, setProducts] = useState([]);

  const productPage = /^\/products\/\w+$/.test(pathname);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  return (
    <div
      className={`px-5 py-10 z-40 ${productPage ? "fixed" : "relative"} w-full`}
    >
      <div className="top flex items-center justify-between">
        <div className="flex items-center gap-5">
          {productPage ||
          pathname === "/auth/login" ||
          pathname === "/auth/sign-up" ||
          pathname === "/search" ? (
            <img
              alt="back"
              src="/arrowback.svg"
              onClick={() => navigate(-1)}
              className="menu text-4xl cursor-pointer"
            />
          ) : (
            <img alt="menu" src="/hamburger.svg" className="menu text-4xl" />
          )}

          <div className={`gap-5 font-medium text-lg hidden lg:flex`}>
            <Link className="hover:font-bold" to={`/`}>
              Home
            </Link>
            <Link className="hover:font-bold" to={`/products`}>
              Browse
            </Link>
            <Link className="hover:font-bold" to={`/new`}>
              New
            </Link>
          </div>
        </div>
        {!productPage && (
          <Link to={`/`}>
            <img src="/logo.svg" alt="logo" className="w-7" />
          </Link>
        )}
        <div className="flex items-center gap-1 lg:gap-10">
          <Link
            to={`/favorites`}
            className="bg-black hidden lg:block text-white p-3 rounded-full"
          >
            <BiHeart />
          </Link>
          <div className="flex items-center">
            <p className="bg-black hidden lg:block font-medium text-white px-5 py-2 rounded-3xl">
              Cart
            </p>
            <Link
              to={"/cart"}
              className="bg-white p-2 flex flex-row-reverse items-center rounded-full border-4 border-black"
            >
              {cart.length > 0 && (
                <div className="w-1 h-1 absolute mt-1 bg-[#E51515] rounded-full"></div>
              )}
              <HiOutlineShoppingBag className="relative" />
            </Link>
          </div>

          <Link
            to={"/profile"}
            className="bg-black cursor-pointer text-white p-3 rounded-full"
          >
            <RiUser6Line />
          </Link>
        </div>
      </div>

      {productPage ||
      pathname === "/cart" ||
      pathname === "/search" ||
      pathname === "/favorites" ||
      pathname === "/profile" ||
      pathname === "/auth/sign-up" ||
      pathname === "/auth/login" ||
      pathname === "/checkout" ||
      pathname === "/payment-success" ? null : (
        <form onSubmit={handleSubmit} className="mt-5 relative">
          <FiSearch className="absolute top-3 left-3" />
          <input
            value={query}
            name="query"
            onChange={(e) => setQuery(e.target.value)}
            className="border-2 outline-none placeholder:text-right placeholder:tracking-widest bg-[#D9D9D9] border-none w-full lg:w-70 rounded-sm px-5 pl-8 py-2"
            type="search"
            placeholder="Search"
          />
        </form>
      )}
    </div>
  );
};

export default Navbar;
