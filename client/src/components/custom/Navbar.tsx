import { Menu, Search, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

type NavbarProps = {
  toggleSidebar: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
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

        {!token ? (
          <>
            <Button
              onClick={() => navigate("/signin")}
              className={"cursor-pointer px-4"}
            >
              Login
            </Button>
          </>
        ) : (
          <ProfileDropdown />
        )}
      </div>
    </nav>
  );
}
