import { Card } from "@/components/ui/card";

export default function VideoCard({ video }) {
  return (
    <Card className="overflow-hidden py-0 hover:shadow-xl transition cursor-pointer">
      <div className="aspect-video bg-black">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-fit"
        />
      </div>
    </Card>
  );
}
