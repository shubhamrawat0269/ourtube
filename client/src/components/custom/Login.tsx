import { z } from "zod";
import api from "@/lib/api";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const res = await api.post(`/api/users/signin`, data);
      if (!res.status) alert(res.data.message);

      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("userDetails", JSON.stringify(res.data.user));
      navigate("/");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input type="password" {...register("password")} />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center">
              <Link to={`/signup`} className="pr-2 text-sm text-blue-500">
                Create Your Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
