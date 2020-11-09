import React from "react";

import { debounce } from "src/util";

export const useWindowDimensions = (): { width: number; height: number } => {
  const [dimensions, setDimensions] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    const debouncedResize = debounce(handleResize, 20, false);

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  return dimensions;
};
