import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Signup from "./components/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
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
