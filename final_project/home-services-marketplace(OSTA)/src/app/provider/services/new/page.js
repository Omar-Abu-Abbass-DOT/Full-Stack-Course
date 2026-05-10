"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ServiceForm from "@/components/ServiceForm";

function NewServiceContent() {
  const router = useRouter();
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      await api.post("/services", data);
      toast.success("Service created");
      router.push("/provider/services");
    } catch (err) {
      toast.error(err.message || "Failed to create");
    }
  };

  return (
    <div className="container section" style={{ maxWidth: 800 }}>
      <h1 className="text-2xl font-bold mb-2">New Service</h1>
      <p className="text-muted mb-6">Add a service for customers to book.</p>
      <div className="card">
        <div className="card-body">
          <ServiceForm onSubmit={onSubmit} submitLabel="Create Service" />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute roles={["provider", "admin"]}>
      <NewServiceContent />
    </ProtectedRoute>
  );
}
