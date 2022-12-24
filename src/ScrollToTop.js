import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () =>  {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0, 0);
  }, [pathname]);

  return null;
}

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export { ScrollToTop, capitalize }