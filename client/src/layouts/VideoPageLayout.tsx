import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/custom/Navbar";

function VideoPageLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Body */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default VideoPageLayout;
