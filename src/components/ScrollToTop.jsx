import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash (e.g. /#features), let the browser or custom logic handle the scroll.
    // Otherwise, scroll to the very top.
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // Small timeout to allow the page to render before scrolling to the hash element
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);

  return null;
}
