"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLocale } from "@/contexts/LocaleContext";
import Spinner from "@/components/Spinner";
import RatingStars from "@/components/RatingStars";
import MapEmbed from "@/components/MapEmbed";

export default function ServiceDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { t, tCategory, tServiceTitle, tServiceDesc, tLocation } = useLocale();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingDate, setBookingDate] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, r] = await Promise.all([
        api.get(`/services/${id}`),
        api.get(`/reviews?service=${id}&limit=20`),
      ]);
      setService(s.service);
      setReviews(r.reviews || []);
      setAverageRating(r.averageRating || 0);
    } catch (err) {
      setError(err.message || t("error.notFound"));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?next=/services/${id}`);
      return;
    }
    if (user.role !== "customer") {
      toast.error("Only customers can book services");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/bookings", {
        service: id,
        date: bookingDate,
        notes: bookingNotes,
      });
      toast.success("✓");
      setBookingDate("");
      setBookingNotes("");
      router.push("/bookings");
    } catch (err) {
      toast.error(err.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?next=/services/${id}`);
      return;
    }
    setReviewSubmitting(true);
    try {
      await api.post("/reviews", {
        service: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("✓");
      setReviewComment("");
      setReviewRating(5);
      await load();
    } catch (err) {
      toast.error(err.message || "Review failed");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container section">
        <Spinner label={t("action.loading")} />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container section">
        <div className="alert alert-error">{error || "Service not found"}</div>
        <Link href="/services" className="btn btn-outline">← {t("service.allServices")}</Link>
      </div>
    );
  }

  const minDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);
  const hasCoords =
    service.coordinates &&
    typeof service.coordinates.lat === "number" &&
    typeof service.coordinates.lng === "number";

  return (
    <div className="container section">
      <Link href="/services" className="text-muted text-sm">← {t("service.allServices")}</Link>

      <div className="service-hero mt-4">
        <div className="image-wrap">
          {service.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={service.image} alt={service.title} />
          ) : null}
        </div>

        <div>
          <div className="flex gap-2 mb-3" style={{ flexWrap: "wrap" }}>
            <span className="badge">{tCategory(service.category)}</span>
            <span className="badge badge-muted">📍 {tLocation(service.location)}</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">{tServiceTitle(service.title)}</h1>

          <div className="flex items-center gap-2 mb-4">
            <RatingStars value={averageRating} size={18} />
            <span className="text-muted text-sm">
              {averageRating ? averageRating.toFixed(1) : t("reviews.noRatings")} · {reviews.length} {t("reviews.title").toLowerCase()}
            </span>
          </div>

          <p className="text-muted mb-4">{tServiceDesc(service.description)}</p>

          <div className="price-tag mb-4">${service.price}</div>

          {service.provider && (
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div className="card-body">
                <div className="text-sm text-muted mb-1">{t("service.provider")}</div>
                <div className="font-semibold">{service.provider.name}</div>
                {service.provider.email && (
                  <div className="text-sm text-muted">{service.provider.email}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {hasCoords && (
        <MapEmbed
          lat={service.coordinates.lat}
          lng={service.coordinates.lng}
        />
      )}

      {(!user || user.role === "customer") && (
        <section className="card mb-8">
          <div className="card-body">
            <h2 className="text-xl font-bold mb-4">{t("service.book")}</h2>
            <form onSubmit={handleBook}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t("service.bookDate")}</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={minDate}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t("service.notes")}</label>
                <textarea
                  className="form-control"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder={t("service.notesPlaceholder")}
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="btn btn-accent btn-lg"
                disabled={submitting}
              >
                {submitting ? t("service.booking") : user ? t("service.confirm") : t("service.loginToBook")}
              </button>
            </form>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">
          {t("reviews.title")} ({reviews.length})
        </h2>

        {user?.role === "customer" && (
          <div className="card mb-6">
            <div className="card-body">
              <h3 className="font-bold mb-3">{t("reviews.leave")}</h3>
              <form onSubmit={handleReview}>
                <div className="mb-3">
                  <RatingStars
                    value={reviewRating}
                    interactive
                    size={28}
                    onChange={setReviewRating}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t("reviews.placeholder")}
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? t("reviews.posting") : t("reviews.post")}
                </button>
                <p className="form-hint mt-2">{t("reviews.hint")}</p>
              </form>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-muted">{t("reviews.empty")}</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="list-item">
              <div className="flex justify-between items-center mb-2" style={{ flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div className="font-semibold">{r.customer?.name || "Anonymous"}</div>
                  <div className="text-xs text-muted">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <RatingStars value={r.rating} />
              </div>
              {r.comment && <p className="text-sm" style={{ marginBottom: 0 }}>{r.comment}</p>}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
