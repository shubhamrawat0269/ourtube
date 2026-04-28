import { createBrowserRouter } from "react-router-dom";
import Login from "./components/custom/Login";
import Signup from "./components/custom/Signup";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import UploadVideo from "./pages/UploadVideo";
import Video from "./pages/Video";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import VideoSinglePage from "./pages/VideoSinglePage";
import VideoPageLayout from "./layouts/VideoPageLayout";

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
        element: (
          <ProtectedRoute>
            <UploadVideo />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-videos",
        element: (
          <ProtectedRoute>
            <Video />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
    children: [],
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
    children: [],
  },
  {
    path: "/watch",
    element: <VideoPageLayout />,
    children: [
      {
        path: "/watch",
        element: <VideoSinglePage />,
      },
    ],
  },
]);

export default router;
