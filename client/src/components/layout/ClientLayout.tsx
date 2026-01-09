"use client";

import { useAuthContext } from "@/context/AuthContext";
import InitialLoader from "@/components/ui/InitialLoader";
import { ReactNode, useEffect, useState } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuthContext();
  const [shouldShowLoader, setShouldShowLoader] = useState(true);

  useEffect(() => {
    // If auth finishes, we can hide loader (InitialLoader has internal min-duration logic too)
    if (!loading) {
        setShouldShowLoader(false);
        return;
    }

    // Failsafe: Force hide loader after 8 seconds if auth is still pending (e.g. backend sleeping or dead)
    // This allows the user to see the site even if auth is stuck.
    const failsafeTimer = setTimeout(() => {
        console.warn("Loading timeout hit - forcing UI to render.");
        setShouldShowLoader(false);
    }, 8000);

    return () => clearTimeout(failsafeTimer);
  }, [loading]);
  
  return (
    <>
      <InitialLoader isLoading={shouldShowLoader} />
      {children}
    </>
  );
}
