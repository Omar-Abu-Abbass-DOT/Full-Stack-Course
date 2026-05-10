export default function Spinner({ label = "Loading…", size = 40 }) {
  return (
    <div className="spinner-wrap">
      <div
        className="spinner"
        style={{ width: size, height: size }}
        role="status"
        aria-label={label}
      />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}
