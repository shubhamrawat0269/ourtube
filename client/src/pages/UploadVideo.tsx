import { useState } from "react";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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

      const res = await api.post(`/api/videos/upload-video`, formData);

      toast.success(res.data.message);

      reset();
      setVideoPreview(null);
      setThumbPreview(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="rounded-2xl shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Upload New Video 🎬
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* LEFT - DETAILS */}
            <div className="space-y-5">
              <div>
                <Label>Title</Label>
                <Input placeholder="Enter video title" {...register("title")} />
                <p className="text-red-500 text-sm">{errors.title?.message}</p>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={5}
                  placeholder="Tell viewers about your video"
                  {...register("description")}
                />
                <p className="text-red-500 text-sm">
                  {errors.description?.message}
                </p>
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  placeholder="e.g. Tech, Education"
                  {...register("category")}
                />
                <p className="text-red-500 text-sm">
                  {errors.category?.message}
                </p>
              </div>

              <div>
                <Label>Tags</Label>
                <Input
                  placeholder="react, node, tutorial"
                  {...register("tags")}
                />
                <p className="text-red-500 text-sm">{errors.tags?.message}</p>
              </div>
            </div>

            {/* RIGHT - FILE UPLOAD */}
            <div className="space-y-6">
              {/* VIDEO */}
              <div className="border-2 border-dashed rounded-xl p-5 text-center hover:border-primary transition">
                <Label className="block mb-2 font-medium">
                  Upload Video 🎥
                </Label>

                <Input
                  type="file"
                  accept="video/*"
                  {...register("video")}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVideoPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {videoPreview && (
                  <video
                    src={videoPreview}
                    controls
                    className="mt-4 rounded-lg max-h-40 mx-auto"
                  />
                )}

                <p className="text-red-500 text-sm">{errors.video?.message?.toString()}</p>
              </div>

              {/* THUMBNAIL */}
              <div className="border-2 border-dashed rounded-xl p-5 text-center hover:border-primary transition">
                <Label className="block mb-2 font-medium">
                  Upload Thumbnail 🖼️
                </Label>

                <Input
                  type="file"
                  accept="image/*"
                  {...register("thumbnail")}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setThumbPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {thumbPreview && (
                  <img
                    src={thumbPreview}
                    alt="Preview"
                    className="mt-4 rounded-lg max-h-40 mx-auto"
                  />
                )}

                <p className="text-red-500 text-sm">
                  {errors.thumbnail?.message?.toString()}
                </p>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full cursor-pointer text-base py-5 rounded-md"
                disabled={loading}
              >
                {loading ? "Uploading..." : "🚀 Upload Video"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadVideo;
