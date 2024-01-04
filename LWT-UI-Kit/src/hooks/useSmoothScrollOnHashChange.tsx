import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useSmoothScrollOnHashChange() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // would be cool to be stop default jump to # if we go directly to this page with a hash
    // window.history.replaceState('', document.title, window.location.pathname);
    const foundElement = document.getElementById(location.hash.slice(1));
    if (foundElement) {
      foundElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);
}
