"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [user, loading, router, roles]);

  if (loading || !user) {
    return (
      <div className="container section">
        <Spinner label="Loading…" />
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container section">
        <div className="alert alert-error">
          You do not have access to this page.
        </div>
      </div>
    );
  }

  return children;
}
