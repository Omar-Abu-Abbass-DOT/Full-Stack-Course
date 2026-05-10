"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ServiceForm from "@/components/ServiceForm";
import Spinner from "@/components/Spinner";

function EditServiceContent({ id }) {
  const router = useRouter();
  const toast = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/services/${id}`)
      .then((d) => setService(d.service))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/services/${id}`, data);
      toast.success("Service updated");
      router.push("/provider/services");
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  if (loading) return <div className="container section"><Spinner /></div>;
  if (!service) return <div className="container section">Service not found</div>;

  return (
    <div className="container section" style={{ maxWidth: 800 }}>
      <h1 className="text-2xl font-bold mb-2">Edit Service</h1>
      <p className="text-muted mb-6">Update your service details.</p>
      <div className="card">
        <div className="card-body">
          <ServiceForm
            initial={{
              title: service.title,
              description: service.description,
              category: service.category,
              price: service.price,
              location: service.location,
              image: service.image || "",
            }}
            onSubmit={onSubmit}
            submitLabel="Update Service"
          />
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }) {
  const { id } = use(params);
  return (
    <ProtectedRoute roles={["provider", "admin"]}>
      <EditServiceContent id={id} />
    </ProtectedRoute>
  );
}
