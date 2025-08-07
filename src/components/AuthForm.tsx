"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function AuthForm({ type }: { type: "login" | "register" }) {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "register") {
      await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      router.push("/login");
    } else {
      const res = await signIn("credentials", {
        redirect: false,
        ...data,
      });

      if (!res?.error) router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-10">
      <input
        className="w-full p-2 border"
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <input
        className="w-full p-2 border"
        placeholder="Password"
        type="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <button type="submit" className="w-full p-2 bg-black text-white">
        {type === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}
