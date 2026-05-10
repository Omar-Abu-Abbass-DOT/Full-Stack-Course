"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { useToast } from "@/contexts/ToastContext";
import { useLocale } from "@/contexts/LocaleContext";
import MapEmbed from "./MapEmbed";

export default function ServiceForm({ initial, onSubmit, submitLabel }) {
  const toast = useToast();
  const { t } = useLocale();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    image: "",
    coordinates: null,
    ...(initial || {}),
  });
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    api
      .get("/categories?limit=100")
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = await api.post("/upload", { image: reader.result });
        setForm((f) => ({ ...f, image: data.url }));
        toast.success("✓");
      } catch (err) {
        toast.error(err.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          coordinates: {
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          },
        }));
        setDetecting(false);
        toast.success("✓");
      },
      () => {
        toast.error("Could not get location");
        setDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hasCoords = form.coordinates && form.coordinates.lat && form.coordinates.lng;

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          name="title"
          className="form-control"
          value={form.title}
          onChange={onChange}
          required
          minLength={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={form.description}
          onChange={onChange}
          required
          minLength={10}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{t("services.category")}</label>
          <input
            name="category"
            className="form-control"
            value={form.category}
            onChange={onChange}
            list="category-options"
            required
            placeholder="e.g. Cleaning"
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c._id} value={c.name} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label className="form-label">{t("services.priceLabel")}</label>
          <input
            name="price"
            type="number"
            min="1"
            step="0.01"
            className="form-control"
            value={form.price}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t("services.location")}</label>
          <input
            name="location"
            className="form-control"
            value={form.location}
            onChange={onChange}
            required
            placeholder="e.g. Amman"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t("provider.coords")}</label>
        <div className="flex gap-2 mb-2" style={{ flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={detectLocation}
            disabled={detecting}
          >
            📍 {detecting ? t("provider.detecting") : t("provider.useMyLocation")}
          </button>
          {hasCoords && (
            <span className="text-sm text-muted" style={{ alignSelf: "center" }}>
              {form.coordinates.lat.toFixed(4)}, {form.coordinates.lng.toFixed(4)}
            </span>
          )}
        </div>
        {hasCoords && (
          <MapEmbed
            lat={form.coordinates.lat}
            lng={form.coordinates.lng}
            height={220}
          />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files?.[0])}
          disabled={uploading}
          className="form-control"
        />
        {uploading && <div className="form-hint">{t("action.uploading")}</div>}
        {form.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.image}
            alt="Preview"
            style={{
              marginTop: 12,
              maxHeight: 180,
              borderRadius: "var(--radius)",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
        {submitting ? t("action.saving") : submitLabel || t("action.save")}
      </button>
    </form>
  );
}
