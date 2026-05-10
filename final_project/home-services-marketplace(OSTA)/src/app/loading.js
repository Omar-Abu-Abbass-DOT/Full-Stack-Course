import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="container section">
      <Spinner label="Loading…" />
    </div>
  );
}
