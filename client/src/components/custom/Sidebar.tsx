import { Home, Flame, Video } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen }) {
  return (
    <aside
      className={`bg-background border-r h-full p-3 space-y-2 transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      <SidebarItem
        icon={<Home size={20} />}
        label="Home"
        link={"/"}
        isOpen={isOpen}
      />
      <SidebarItem
        icon={<Flame size={20} />}
        label="My Videos"
        link={"/my-videos"}
        isOpen={isOpen}
      />
      <SidebarItem
        icon={<Video size={20} />}
        label="Upload Video"
        link={"/upload-video"}
        isOpen={isOpen}
      />
    </aside>
  );
}

function SidebarItem({ icon, label, isOpen, link }) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        isActive ? "text-gray-800 font-bold" : "text-gray-500"
      }
    >
      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
        <div className="">{icon}</div>
        {isOpen && <span className="text-sm">{label}</span>}
      </div>
    </NavLink>
  );
}

export default Sidebar;
