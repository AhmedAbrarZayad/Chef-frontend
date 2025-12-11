import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Hooks/useAuth";
import LoadingScreen from "../Components/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import ErrorPage from "../Components/ErrorPage";

const ChefRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['chef-status', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users-role?email=${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email, 
  });

  const isChef = data?.role === "chef";

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

  if (!isChef) {
    return <Navigate to="*" replace />;
  }

  return children;
};

export default ChefRoute;
