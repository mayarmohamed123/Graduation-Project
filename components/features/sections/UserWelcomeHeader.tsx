"use client";

import { useUser } from "@/hooks/useUser";

export default function UserWelcomeHeader() {
  const { user, isLoading } = useUser();
  const userName = user?.userName;

  return (
    <h1 className="heading text-center">
      Welcome back, {isLoading ? "..." : (userName || "User")}!👋
    </h1>
  );
}
