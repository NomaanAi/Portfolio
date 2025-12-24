"use client";

import AuthLayout from "@/app/(auth)/layout";

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
