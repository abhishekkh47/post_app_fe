import { useBrandAnimation } from "../../hooks";

export const AnimatedBrand = () => {
  const { displayedText } = useBrandAnimation();

  return (
    <div className="text-center md:text-right">
      <h1 className="text-blue-600 text-7xl font-bold relative">
        <span className="inline-block transition-all duration-300 transform hover:scale-105">
          {displayedText}
        </span>
        <p className="mt-4 text-xl text-gray-700">
          Postal helps you connect and share with the people in your life.
        </p>
      </h1>
    </div>
  );
};
