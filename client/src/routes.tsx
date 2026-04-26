import { createBrowserRouter } from "react-router-dom";
import Login from "./components/custom/Login";
import Signup from "./components/custom/Signup";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import UploadVideo from "./pages/UploadVideo";
import Video from "./pages/Video";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/upload-video",
        element: <UploadVideo />,
      },
      {
        path: "/my-videos",
        element: <Video />,
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
