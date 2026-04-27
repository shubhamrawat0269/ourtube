import api from "@/lib/api";
import { toast } from "sonner";
import VideoCard from "./VideoCard";
import { useEffect, useState } from "react";
import VideoCardSkeleton from "./VideoCardSkeleton";

export default function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/videos/all-videos`);
      setVideos(res.data.videos);
    } catch (error) {
      toast.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/videos/delete-video/${id}`);

      toast.success("Video deleted");
      fetchVideos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = async (video) => {
    // const newTitle = prompt("Enter new title", video.title);
    // if (!newTitle) return;

    try {
    //   await axios.put(
    //     `${API}/api/videos/update-video/${video._id}`,
    //     { title: newTitle },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     },
    //   );

    //   toast.success("Video updated");
    //   fetchVideos();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // ================= UI =================
  if (loading) return <VideoCardSkeleton />;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
