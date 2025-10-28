import React from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { User } from "@/types";

export const useAuth = (requiredAuth: boolean = false) => {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (authUser) => {
      console.log("useAuth", authUser);
      setUser(authUser);
      setLoading(false);

      if (requiredAuth && !authUser) {
        setError("You need to login to continue");
        router.push("/auth");
      } else if (!requiredAuth && authUser) {
        router.push("/chat");
      }

      return () => unsubscribe();
    });
  }, [requiredAuth, router]);

  return { user, loading, error };
};
