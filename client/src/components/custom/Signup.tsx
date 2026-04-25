import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
const API = 'http://localhost:8082';

// Zod Schema
const signupSchema = z.object({
  channelName: z.string().min(3, "Channel name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  logo: z.any().refine((file) => file?.length === 1, "Logo is required"),
});

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("channelName", data.channelName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("logo", data.logo[0]);

      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      const res = await axios.post(`${API}/api/users/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.status) alert(res.data.message);
      navigate("/signin");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Create your account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Channel Name */}
            <div className="space-y-1">
              <Label>Channel Name</Label>
              <Input
                placeholder="Enter channel name"
                {...register("channelName")}
              />
              {errors.channelName && (
                <p className="text-sm text-red-500">
                  {errors.channelName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input placeholder="Enter phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Logo */}
            <div className="space-y-1">
              <Label>Channel Logo</Label>
              <Input type="file" accept="image/*" {...register("logo")} />
              {/* {errors.logo && (
                <p className="text-sm text-red-500">{errors.logo.message}</p>
              )} */}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Signup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
