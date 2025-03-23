
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PublicLayout } from "@/components/Layout/PublicLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PublicLayout>
      <div className="text-center py-12">
        <h1 className="font-heading font-bold text-6xl md:text-7xl text-gray-900 dark:text-white mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="btn-primary inline-block"
        >
          Return to Home
        </Link>
      </div>
    </PublicLayout>
  );
};

export default NotFound;
