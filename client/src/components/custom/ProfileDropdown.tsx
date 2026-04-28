import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfileDropdown() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("userDetails");
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userDetails");

      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="rounded-full">
          <Avatar>
            <AvatarFallback>
              {user?.channelName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem disabled>
          {user?.channelName || "User"}
        </DropdownMenuItem>

        <DropdownMenuItem className={'cursor-pointer'} onClick={() => navigate("/my-videos")}>
          My Videos
        </DropdownMenuItem>

        <DropdownMenuItem className={'cursor-pointer'} onClick={() => navigate("/upload-video")}>
          Upload Video
        </DropdownMenuItem>

        <DropdownMenuItem  onClick={handleLogout} className="text-red-500 cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
