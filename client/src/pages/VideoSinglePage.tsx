import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";

function formatViews(views: number) {
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M views";
  if (views >= 1_000) return (views / 1_000).toFixed(1) + "K views";
  return views + " views";
}

function timeAgo(date: string) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  const units = [
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (let unit of units) {
    const val = Math.floor(diff / unit.seconds);
    if (val >= 1) return `${val} ${unit.label}${val > 1 ? "s" : ""} ago`;
  }

  return "Just now";
}

const VideoSinglePage = () => {
  const [searchParams] = useSearchParams();
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const videoId = searchParams.get("v");

  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/api/videos/video/${videoId}`);
        setVideo(res.data.video);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) return <p className="p-6">Loading video...</p>;
  if (!video)
    return (
      <p className="p-6 text-red-500">Video not found or failed to load</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-4">
        {/* VIDEO PLAYER */}
        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-lg font-semibold">{video?.title || "Hi"}</h1>

        {/* CHANNEL + ACTIONS */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* CHANNEL */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={video?.channelLogo} />
              <AvatarFallback>{video.channelName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">{video?.channelName}</p>
              <p className="text-xs text-muted-foreground">
                {formatViews(video?.views)} • {timeAgo(video?.createdAt)}
              </p>
            </div>

            <Button size="sm">Subscribe</Button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2">
            <Button variant="outline">👍 Like</Button>
            <Button variant="outline">👎 Dislike</Button>
            <Button variant="outline">Share</Button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <Card className="p-4 text-sm">{video?.description}</Card>

        {/* COMMENTS (basic) */}
        <div>
          <h2 className="font-semibold mb-2">Comments</h2>
          <Card className="p-4 text-sm text-muted-foreground">
            Comment system coming soon...
          </Card>
        </div>
      </div>

      {/* RIGHT SIDE - RELATED VIDEOS */}
      <div className="space-y-4">
        {related.map((item: any) => (
          <div
            key={item._id}
            className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded-lg"
          >
            <img
              src={item?.thumbnailUrl}
              className="w-40 h-24 object-cover rounded-lg"
            />

            <div className="text-sm">
              <p className="font-medium line-clamp-2">{item?.title}</p>
              <p className="text-xs text-muted-foreground">
                {item?.channelName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatViews(item?.views)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSinglePage;
