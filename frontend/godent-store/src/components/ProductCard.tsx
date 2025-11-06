import { useState } from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";

interface productsProps {
  name: string;
  price: any;
  category: string;
  image_url: string;
  index: number;
  productLink: string;
  bgColor: string;
  cartText: string;
  inCartIcon: IconType;
  clickAction: () => void;
  desktopCartText: string;
}

const ProductCard = ({
  name,
  price,
  category,
  image_url,
  index,
  productLink,
  clickAction,
  bgColor,
  cartText,
  inCartIcon,
  desktopCartText,
}: productsProps) => {
  const [showButtonIndex, setShowButtonIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const handleShow = (id: number) => {
    setShowButtonIndex((prev) => (prev === id ? prev : id));
  };
  return (
    <div key={index} className="flex flex-col font-cormorant">
      <div
        onMouseEnter={() => {
          handleShow(index);
          setShowButton(true);
        }}
        onMouseLeave={() => {
          setShowButton(false);
        }}
        className="w-full border relative border-gray-300 transition-all ease-in-out duration-300"
      >
        <Link to={productLink}>
          <img
            src={image_url}
            alt={name.slice(0, 16)}
            className="w-full h-72"
          />
        </Link>

        {showButton && showButtonIndex === index ? (
          <button
            onClick={clickAction}
            className={`absolute cursor-pointer right-0 bottom-0 bg-violet-400/50  text-black py-1 px-3 transition-all ease-in-out duration-300`}
          >
            {desktopCartText}
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-gray-500 text-xs">{category}</p>
      <div className="flex justify-between">
        <div>
          <h3 className="line-clamp-1">{name}</h3>
          <button
            onClick={clickAction}
            className={`lg:hidden ${bgColor} text-white cursor-pointer flex items-center gap-1 px-5 py-1 mt-2 font-bold`}
          >
            {cartText}
            {inCartIcon}
          </button>
        </div>
        <h3 className="text-violet-900 font-bold">$ {price}</h3>
      </div>
    </div>
  );
};

export default ProductCard;
