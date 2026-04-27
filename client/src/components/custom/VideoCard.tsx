import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

function formatViews(views) {
  if (!views) return "0 views";
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M views";
  if (views >= 1_000) return (views / 1_000).toFixed(1) + "K views";
  return views + " views";
}

function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (let unit of units) {
    const value = Math.floor(diff / unit.seconds);
    if (value >= 1) {
      return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  function navigateToSingleVideoSection() {
    navigate(`/watch?v=${video._id}`);
  }
  return (
    <Card
      className="border-0 ring-0 shadow-none cursor-pointer py-0 rounded-xl"
      onClick={navigateToSingleVideoSection}
    >
      <div className="aspect-video rounded-xl overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition duration-300"
        />
      </div>

      <div className="flex gap-3">
        {/* CHANNEL AVATAR */}
        <Avatar className="h-9 w-9">
          <AvatarImage src={video?.channelLogo} />
          <AvatarFallback>
            {video?.channelName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        {/* TEXT CONTENT */}
        <div className="flex flex-col">
          <h3 className="font-medium text-sm leading-snug line-clamp-2">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {video.channelName}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatViews(video.views)} • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}
