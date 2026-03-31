"use client";

export default function Error({ error, reset }) {
  return (
    <main className="container">
      <div className="error-container">
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button className="btn btn-primary" onClick={() => reset()}>
          Try Again
        </button>
      </div>
    </main>
  );
}
