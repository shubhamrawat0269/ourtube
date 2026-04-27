import { Menu, Search, Bell, User } from "lucide-react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar({ toggleSidebar }) {
  const token = localStorage.getItem("token");
  const userDetailToken = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetailToken);

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
          <AvatarImage src={userDetails?.logoUrl} alt={userDetails?.logoId} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
