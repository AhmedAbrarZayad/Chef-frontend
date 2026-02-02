import { Suspense } from "react";
import LoadingScreen from "../Components/LoadingScreen";

/**
 * Wrapper component for lazy-loaded routes
 * Provides a fallback loading screen while route components are being loaded
 */
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export default LazyWrapper;
