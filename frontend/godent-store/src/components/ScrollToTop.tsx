import { BiChevronUp } from "react-icons/bi";

const ScrollToTop = () => {
  return (
    <div
      role="button"
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      className="fixed z-50 bottom-3 right-2 cursor-pointer hover:bg-violet-500 bg-violet-600 text-3xl text-white rounded-full transition-all ease-in-out duration-300  w-fit px-1 py-1"
    >
      <BiChevronUp />
    </div>
  );
};

export default ScrollToTop;
