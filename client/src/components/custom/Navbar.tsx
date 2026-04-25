import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  Home,
  Flame,
  Video,
  History,
} from "lucide-react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ================= NAVBAR ================= //
function Navbar({ toggleSidebar }) {
  const token = localStorage.getItem("token");

  return (
    <nav className="w-full border-b bg-background px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold hidden sm:block">OurTube</h1>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center gap-2">
        <Input placeholder="Search" className="rounded-full" />
        <Button variant="secondary" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {!token && (
          <>
            <Link to={`/signin`} className="pr-2 text-base underline">
              Login
            </Link>
            <Link to={`/signup`} className="pr-2 text-base underline">
              Register
            </Link>
          </>
        )}

        <Avatar>
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

// ================= SIDEBAR ================= //
function Sidebar({ isOpen }) {
  return (
    <aside
      className={`bg-background border-r h-full p-3 space-y-2 transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      <SidebarItem icon={<Home />} label="Home" isOpen={isOpen} />
      <SidebarItem icon={<Flame />} label="Trending" isOpen={isOpen} />
      <SidebarItem icon={<Video />} label="Subscriptions" isOpen={isOpen} />
      <SidebarItem icon={<History />} label="History" isOpen={isOpen} />
    </aside>
  );
}

function SidebarItem({ icon, label, isOpen }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
      <div className="h-5 w-5">{icon}</div>
      {isOpen && <span className="text-sm">{label}</span>}
    </div>
  );
}

// ================= MAIN LAYOUT ================= //
export default function YouTubeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-muted rounded-xl h-40" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
