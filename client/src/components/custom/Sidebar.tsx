import { Home, Flame, Video, History } from "lucide-react";

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

export default Sidebar;
