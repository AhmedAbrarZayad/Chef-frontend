import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Hooks/useAuth";
import LoadingScreen from "../Components/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import ErrorPage from "../Components/ErrorPage";

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['user-role', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/user-role?email=${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email, 
  });
  console.log(data);
  const isUser = data?.role === "user";

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

  if (!isUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserRoute;
