"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api, { buildQuery } from "@/lib/apiClient";
import ServiceCard from "@/components/ServiceCard";
import Pagination from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { useLocale } from "@/contexts/LocaleContext";

function ServicesContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { t, tCategory } = useLocale();

  const [services, setServices] = useState([]);
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search:   params.get("search")   || "",
    category: params.get("category") || "",
    location: params.get("location") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
  });

  useEffect(() => {
    api.get("/categories?limit=100")
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  const fetchServices = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError("");
    try {
      const query = buildQuery({ ...filters, page, limit: 9, ...overrides });
      const data = await api.get(`/services${query}`);
      setServices(data.services || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const updateUrl = (next) => {
    const qs = buildQuery({ ...filters, ...next, page: next.page || page });
    router.replace(`/services${qs}`, { scroll: false });
  };

  const onChange = (e) => setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateUrl({ page: 1 });
    fetchServices({ page: 1 });
  };

  const onClear = () => {
    const empty = { search: "", category: "", location: "", minPrice: "", maxPrice: "" };
    setFilters(empty);
    setPage(1);
    router.replace("/services");
    fetchServices({ ...empty, page: 1 });
  };

  const onPageChange = (p) => {
    setPage(p);
    updateUrl({ page: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="container section">
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="text-2xl font-bold" style={{ marginBottom: "0.3rem", letterSpacing: "-0.03em" }}>
          {t("services.browse")}
        </h1>
        <p className="text-muted text-sm">
          {loading ? t("services.loading") : t("services.available", { count: total })}
        </p>
      </div>

      {/* Filters */}
      <form className="filters" onSubmit={onSubmit}>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute",
            insetInlineStart: "0.85rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-subtle)",
            fontSize: "1rem",
            pointerEvents: "none",
          }}>🔍</span>
          <input
            name="search"
            className="form-control"
            placeholder={t("services.searchByTitle")}
            value={filters.search}
            onChange={onChange}
            style={{ paddingInlineStart: "2.25rem" }}
          />
        </div>

        <select
          name="category"
          className="form-control"
          value={filters.category}
          onChange={onChange}
        >
          <option value="">{t("services.allCategories")}</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>{tCategory(c.name)}</option>
          ))}
        </select>

        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute",
            insetInlineStart: "0.85rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-subtle)",
            fontSize: "0.9rem",
            pointerEvents: "none",
          }}>📍</span>
          <input
            name="location"
            className="form-control"
            placeholder={t("services.location")}
            value={filters.location}
            onChange={onChange}
            style={{ paddingInlineStart: "2.25rem" }}
          />
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <input
            name="minPrice"
            type="number"
            min="0"
            className="form-control"
            placeholder={t("services.minPrice")}
            value={filters.minPrice}
            onChange={onChange}
          />
          <input
            name="maxPrice"
            type="number"
            min="0"
            className="form-control"
            placeholder={t("services.maxPrice")}
            value={filters.maxPrice}
            onChange={onChange}
          />
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {t("action.search")}
          </button>
          {hasFilters && (
            <button type="button" onClick={onClear} className="btn btn-outline">
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Active filter chips */}
      {hasFilters && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
          {Object.entries(filters).filter(([, v]) => v).map(([k, v]) => (
            <span key={k} className="badge badge-muted" style={{ gap: "0.4rem" }}>
              {k}: {v}
              <button
                type="button"
                onClick={() => {
                  const next = { ...filters, [k]: "" };
                  setFilters(next);
                  fetchServices({ ...next, page: 1 });
                }}
                style={{ color: "inherit", fontSize: "0.75rem", lineHeight: 1 }}
              >✕</button>
            </span>
          ))}
        </div>
      )}

      {/* Error */}
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Results */}
      {loading ? (
        <Spinner label={t("services.findingServices")} />
      ) : services.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={t("services.empty")}
          message={t("services.tryAdjust")}
          action={
            hasFilters && (
              <button onClick={onClear} className="btn btn-outline">
                {t("services.clearAll")}
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="grid grid-services">
            {services.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<Spinner label="Loading…" />}>
      <ServicesContent />
    </Suspense>
  );
}
