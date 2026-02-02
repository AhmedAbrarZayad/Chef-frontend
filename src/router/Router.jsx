import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import LazyWrapper from "../Components/LazyWrapper";

// Critical routes - load immediately
import Root from "../Roots/Root";
import Home from "../Pages/Home";
import ErrorPage from "../Components/ErrorPage";

// Lazy load all other routes
const Meals = lazy(() => import("../Pages/Meals"));
const MealsDetails = lazy(() => import("../Pages/MealsDetails"));
const AuthRoot = lazy(() => import("../Roots/AuthRoot"));
const Login = lazy(() => import("../Components/Login"));
const Register = lazy(() => import("../Components/Register"));
const PrivateRoute = lazy(() => import("../Routes/PrivateRoute"));
const OrderPage = lazy(() => import("../Pages/OrderPage"));
const ProfilePage = lazy(() => import("../Pages/ProfilePage"));
const DashboardRoot = lazy(() => import("../Roots/DashboardRoot"));
const MyOrders = lazy(() => import("../Pages/MyOrders"));
const MyReviews = lazy(() => import("../Pages/MyReviews"));
const MyFavourites = lazy(() => import("../Pages/MyFavourites"));
const PaymentSuccessful = lazy(() => import("../Components/PaymentSuccessful"));
const PaymentFailed = lazy(() => import("../Components/PaymentFailed"));
const CreateMeals = lazy(() => import("../Pages/CreateMeals"));
const MyMeals = lazy(() => import("../Pages/MyMeals"));
const OrderApproval = lazy(() => import("../Pages/OrderApproval"));
const ManageUsers = lazy(() => import("../Pages/ManageUsers"));
const ManageRequests = lazy(() => import("../Pages/ManageRequests"));
const PlatformStatistics = lazy(() => import("../Pages/PlatformStatistics"));
const ChefRoute = lazy(() => import("../Routes/ChefRoute"));
const AdminRoute = lazy(() => import("../Routes/AdminRoute"));
const UserRoute = lazy(() => import("../Routes/UserRoute"));
const About = lazy(() => import("../Pages/About"));
const Contact = lazy(() => import("../Pages/Contact"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "meals",
          element: <LazyWrapper><Meals /></LazyWrapper>
        },
        {
          path: "about",
          element: <LazyWrapper><About /></LazyWrapper>
        },
        {
          path: "contact",
          element: <LazyWrapper><Contact /></LazyWrapper>
        },
        {
          path: "meals/:id",
          element: <LazyWrapper><MealsDetails /></LazyWrapper>
        },
        {
          path: "order/:id",
          element: <LazyWrapper><PrivateRoute><OrderPage /></PrivateRoute></LazyWrapper>
        },
        {
          path: "dashboard",
          element: <LazyWrapper><PrivateRoute><DashboardRoot /></PrivateRoute></LazyWrapper>,
          children: [
            {
              index: true,
              element: <LazyWrapper><ProfilePage /></LazyWrapper>
            },
            {
              path: "orders",
              element: <LazyWrapper><UserRoute><MyOrders /></UserRoute></LazyWrapper>
            },
            {
              path: "reviews",
              element: <LazyWrapper><UserRoute><MyReviews /></UserRoute></LazyWrapper>
            },
            {
              path: "favourites",
              element: <LazyWrapper><UserRoute><MyFavourites /></UserRoute></LazyWrapper>
            },
            {
              path: "create-meal",
              element: <LazyWrapper><ChefRoute><CreateMeals /></ChefRoute></LazyWrapper>
            },
            {
              path: "my-meals",
              element: <LazyWrapper><ChefRoute><MyMeals /></ChefRoute></LazyWrapper>
            },
            {
              path: "order-approval",
              element: <LazyWrapper><ChefRoute><OrderApproval /></ChefRoute></LazyWrapper>
            },
            {
              path: "manage-users",
              element: <LazyWrapper><AdminRoute><ManageUsers /></AdminRoute></LazyWrapper>
            },
            {
              path: "manage-requests",
              element: <LazyWrapper><AdminRoute><ManageRequests /></AdminRoute></LazyWrapper>
            },
            {
              path: "platform-statistics",
              element: <LazyWrapper><AdminRoute><PlatformStatistics /></AdminRoute></LazyWrapper>
            }
          ]
        },
        {
          path: "payment-success",
          element: <LazyWrapper><PrivateRoute><PaymentSuccessful /></PrivateRoute></LazyWrapper>
        },
        {
          path: "payment-failed",  
          element: <LazyWrapper><PrivateRoute><PaymentFailed /></PrivateRoute></LazyWrapper>
        }
    ],
  },
  {
    path: "/auth",
    element: <LazyWrapper><AuthRoot /></LazyWrapper>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LazyWrapper><Login /></LazyWrapper>
      },
      {
        path: "register",
        element: <LazyWrapper><Register /></LazyWrapper>
      }
    ]
  },
  {
    path: "*",
    element: <ErrorPage />
  }
]);
