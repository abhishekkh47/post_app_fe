import { useState, useEffect } from "react";

const useBrandAnimation = () => {
  const [displayedText, setDisplayedText] = useState<string>("p");
  const brandName = "postal.";
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

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

  return { displayedText };
};

export default useBrandAnimation;
