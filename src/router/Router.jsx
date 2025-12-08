import { createBrowserRouter } from "react-router";
import Root from "../Roots/Root";
import Home from "../Pages/Home";
import Meals from "../Pages/Meals";
import MealsDetails from "../Pages/MealsDetails";

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
            element: <MealsDetails />
        }
    ],
  },
]);
