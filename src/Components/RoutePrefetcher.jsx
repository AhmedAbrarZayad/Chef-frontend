import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Routes to prefetch
const routesToPrefetch = [
  () => import('../Pages/Meals'),
  () => import('../Pages/MealsDetails'),
  () => import('../Roots/DashboardRoot'),
  () => import('../Pages/ProfilePage'),
];

/**
 * Component that prefetches critical routes after initial load
 * This improves navigation speed by loading route code in the background
 */
const RoutePrefetcher = () => {
  const location = useLocation();

  useEffect(() => {
    // Wait for initial page to be fully loaded
    if (document.readyState === 'complete') {
      prefetchRoutes();
    } else {
      window.addEventListener('load', prefetchRoutes);
      return () => window.removeEventListener('load', prefetchRoutes);
    }
  }, []);

  const prefetchRoutes = () => {
    // Add a small delay to not interfere with initial page load
    setTimeout(() => {
      routesToPrefetch.forEach((importFn) => {
        // Trigger the import but don't wait for it
        importFn().catch(() => {
          // Silently fail - prefetch is optional
        });
      });
    }, 2000); // Prefetch after 2 seconds
  };

  return null; // This component doesn't render anything
};

export default RoutePrefetcher;
