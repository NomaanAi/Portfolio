"use client";

import { useAuthContext } from "@/context/AuthContext";
// InitialLoader import removed
import { ReactNode, useEffect, useState } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  // removed InitialLoader logic for instant paint
  return (
    <>
      {children}
    </>
  );
}
