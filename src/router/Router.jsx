import { createBrowserRouter } from "react-router";
import Root from "../Roots/Root";
import Home from "../Pages/Home";
import Meals from "../Pages/Meals";
import MealsDetails from "../Pages/MealsDetails";
import AuthRoot from "../Roots/AuthRoot";
import Login from "../Components/Login";
import Register from "../Components/Register";
import PrivateRoute from "../Routes/PrivateRoute";
import OrderPage from "../Pages/OrderPage";
import ProfilePage from "../Pages/ProfilePage";
import DashboardRoot from "../Roots/DashboardRoot";
import MyOrders from "../Pages/MyOrders";
import MyReviews from "../Pages/MyReviews";
import MyFavourites from "../Pages/MyFavourites";
import PaymentSuccessful from "../Components/PaymentSuccessful";
import PaymentFailed from "../Components/PaymentFailed";
import CreateMeals from "../Pages/CreateMeals";
import MyMeals from "../Pages/MyMeals";
import OrderApproval from "../Pages/OrderApproval";
import ManageUsers from "../Pages/ManageUsers";
import ManageRequests from "../Pages/ManageRequests";
import PlatformStatistics from "../Pages/PlatformStatistics";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "meals",
          element: <Meals />
        },
        {
          path: "meals/:id",
          element: <PrivateRoute><MealsDetails /></PrivateRoute>
        },
        {
          path: "order/:id",
          element: <PrivateRoute><OrderPage /></PrivateRoute>
        },
        {
          path: "dashboard",
          element: <PrivateRoute><DashboardRoot /></PrivateRoute>,
          children: [
            {
              index: true,
              element: <ProfilePage />
            },
            {
              path: "orders",
              element: <MyOrders />
            },
            {
              path: "reviews",
              element: <MyReviews />
            },
            {
              path: "favourites",
              element: <MyFavourites />
            },
            {
              path: "create-meal",
              element: <CreateMeals />
            },
            {
              path: "my-meals",
              element: <MyMeals />
            },
            {
              path: "order-approval",
              element: <OrderApproval />
            },
            {
              path: "manage-users",
              element: <ManageUsers />
            },
            {
              path: "manage-requests",
              element: <ManageRequests />
            },
            {
              path: "platform-statistics",
              element: <PlatformStatistics />
            }
          ]
        },
        {
          path: "payment-success",
          element: <PrivateRoute><PaymentSuccessful /></PrivateRoute>
        },
        {
          path: "payment-failed",  
          element: <PrivateRoute><PaymentFailed /></PrivateRoute>
        }
    ],
  },
  {
    path: "/auth",
    element: <AuthRoot />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  },
]);
