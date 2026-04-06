import "@/app/four-month-path/styles/four-month-path.css";
import "./brokers.css";

export default function Loading() {
  return (
    <main className="fmp-page">
      <div className="fmp-bg" aria-hidden />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <div className="brk-loading-spinner" role="status" aria-label="Loading" />
      </div>
    </main>
  );
}
