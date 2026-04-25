import { useState } from "react";
import { Menu, Search, Bell, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-background px-4 py-2 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-xl font-bold hidden sm:block">OurTube</h1>
      </div>

      {/* Center Section (Search) */}
      <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center gap-2">
        <Input placeholder="Search" className="rounded-full" />
        <Button variant="secondary" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Icon */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <Avatar>
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
