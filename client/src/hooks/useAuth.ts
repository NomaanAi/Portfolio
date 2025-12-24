import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(requireAdmin = false) {
  const { user, loading, logout, login, loginAdmin, register } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
        // If admin is required, check if user logic exists or is admin
        if (requireAdmin) {
            if (!user) {
                 router.push("/admin/login");
            } else if (user.role !== "admin") {
                 router.push("/admin/login"); 
            }
        }
    }
  }, [user, loading, requireAdmin, router]);

  return { user, loading, isAdmin: user?.role === "admin", logout, login, loginAdmin, register };
}
