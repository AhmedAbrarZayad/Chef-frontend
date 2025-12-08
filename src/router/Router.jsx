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
  }
]);
