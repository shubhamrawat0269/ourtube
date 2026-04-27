import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Video() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8082";
  const token = JSON.parse(localStorage.getItem("token"));

  // ================= FETCH VIDEOS ================= //
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/videos/own-videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(res.data.videos);
    } catch (error) {
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ================= DELETE VIDEO ================= //
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/videos/delete-video/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success({ title: "Deleted", description: "Video deleted" });
      fetchVideos();
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.response?.data?.message || "Delete failed",
        variant: "destructive",
      });
    }
  };

  // ================= EDIT VIDEO ================= //
  const handleEdit = async (video) => {
    const newTitle = prompt("Enter new title", video.title);
    if (!newTitle) return;

    try {
      await axios.put(
        `${API}/api/videos/update-video/${video._id}`,
        { title: newTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Video updated");
      fetchVideos();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Videos</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Card
              key={video._id}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-black">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardContent className="p-3 space-y-2">
                {/* Title */}
                <h2 className="font-semibold text-sm line-clamp-2">
                  {video.title}
                </h2>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {video.description}
                </p>

                {/* Category */}
                <p className="text-xs text-gray-400">{video.category}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {video.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-muted px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(video)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(video._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
