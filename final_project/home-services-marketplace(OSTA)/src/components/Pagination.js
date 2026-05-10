"use client";

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        style={{ fontWeight: 600 }}
      >
        ← Prev
      </button>

      {/* First page + ellipsis */}
      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} aria-label="Page 1">1</button>
          {start > 2 && (
            <span style={{
              alignSelf: "center",
              color: "var(--color-subtle)",
              fontSize: "0.875rem",
              userSelect: "none",
            }}>
              …
            </span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? "active" : ""}
          onClick={() => onChange(p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span style={{
              alignSelf: "center",
              color: "var(--color-subtle)",
              fontSize: "0.875rem",
              userSelect: "none",
            }}>
              …
            </span>
          )}
          <button onClick={() => onChange(totalPages)} aria-label={`Page ${totalPages}`}>
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        style={{ fontWeight: 600 }}
      >
        Next →
      </button>
    </nav>
  );
}
