import { useState, useEffect } from "react";

export const AnimatedBrand = () => {
  const [displayedText, setDisplayedText] = useState("p");
  const brandName = "postal.";
  const [isAnimating, setIsAnimating] = useState(true);

  const startAnimation = () => {
    setDisplayedText("p");
    setIsAnimating(true);
  };

  useEffect(() => {
    if (!isAnimating) {
      const autoReplayTimer = setTimeout(() => {
        startAnimation();
      }, 5000);

      return () => clearTimeout(autoReplayTimer);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIndex = 1;
    const interval = setInterval(() => {
      if (currentIndex <= brandName.length) {
        setDisplayedText(brandName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="text-center md:text-right">
      <h1 className="text-blue-600 text-7xl font-bold relative">
        <span className="inline-block transition-all duration-300 transform hover:scale-105">
          {displayedText}
        </span>
        {/* {!isAnimating && (
          <button
            onClick={startAnimation}
            className="absolute -right-8 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-blue-60"
          >
            ↺
          </button>
        )} */}
        <p className="mt-4 text-xl text-gray-700">
          Postal helps you connect and share with the people in your life.
        </p>
      </h1>
    </div>
  );
};
