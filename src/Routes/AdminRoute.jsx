import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Hooks/useAuth";
import LoadingScreen from "../Components/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import ErrorPage from "../Components/ErrorPage";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-status', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/user-role?email=${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email, 
  });

  const isAdmin = data?.role === "admin";

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return <Navigate to="*" replace />;
  }

  return children;
};

export default AdminRoute;
