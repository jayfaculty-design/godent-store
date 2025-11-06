const CallToAction = () => {
  return (
    <div className="py-10 px-5">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-center mt-10">
          OUR APPROACH TO FASHION DESIGN
        </h1>
        <p className="text-center mt-3 md:w-1/2 mx-auto lg:text-lg text-gray-800 leading-6 font-cormorant">
          at godent store, we blend creativity with craftmanship to create
          fashion that trascends trends and stands the test of time each design
          is meticulously crafted, ensuring the highest quality exquisite finish
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 md:flex md:justify-center mt-16">
        {[1, 2, 3, 4].map((image, index) => (
          <img
            key={index}
            className={`h-62 w-full md:w-64 ${image % 2 === 0 ? "mt-10" : ""}`}
            src={`/Rectangle-${image}.png`}
            alt="placeholder"
          />
        ))}
      </div>
    </div>
  );
};

export default CallToAction;
