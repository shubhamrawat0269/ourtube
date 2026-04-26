import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
const API = "http://localhost:8082";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(5, "Description is required"),
  category: z.string().min(2, "Category is required"),
  tags: z.string().min(2, "Tags required"),
  video: z.any().refine((file) => file?.length === 1, "Video is required"),
  thumbnail: z
    .any()
    .refine((file) => file?.length === 1, "Thumbnail is required"),
});

const UploadVideo = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("tags", data.tags);
      formData.append("video", data.video[0]);
      formData.append("thumbnail", data.thumbnail[0]);

      const token = localStorage.getItem("token");

      const res = await axios.post(`${API}/api/upload-video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Video Uploaded')

    //   toast({ title: "Success", description: res.data.message });
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: error.response?.data?.message || "Upload failed",
    //     variant: "destructive",
    //   });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload Video</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* LEFT SIDE */}
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input {...register("title")} />
                <p className="text-red-500 text-sm">{errors.title?.message}</p>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea {...register("description")} />
                <p className="text-red-500 text-sm">
                  {errors.description?.message}
                </p>
              </div>

              <div>
                <Label>Category</Label>
                <Input {...register("category")} />
                <p className="text-red-500 text-sm">
                  {errors.category?.message}
                </p>
              </div>

              <div>
                <Label>Tags</Label>
                <Input placeholder="tag1, tag2" {...register("tags")} />
                <p className="text-red-500 text-sm">{errors.tags?.message}</p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-xl p-4 text-center">
                <Label>Upload Video</Label>
                <Input type="file" accept="video/*" {...register("video")} />
                <p className="text-red-500 text-sm">{errors.video?.message}</p>
              </div>

              <div className="border-2 border-dashed rounded-xl p-4 text-center">
                <Label>Upload Thumbnail</Label>
                <Input
                  type="file"
                  accept="image/*"
                  {...register("thumbnail")}
                />
                <p className="text-red-500 text-sm">
                  {errors.thumbnail?.message}
                </p>
              </div>
            </div>

            {/* FULL WIDTH BUTTON */}
            <div className="md:col-span-2">
              <Button className="w-full" disabled={loading}>
                {loading ? "Uploading..." : "Upload Video"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadVideo;
