import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import CardLists from "./pages/CardLists";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <CardLists />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Login />,
    children: [],
  },
  {
    path: "/signup",
    element: <Signup />,
    children: [],
  },
]);

export default router;
