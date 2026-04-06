import "./styles/loading.css";

export default function Loading() {
  return (
    <div className="home-wrapper">
      <div className="background-mesh"></div>
      
      <main className="hero loading-hero">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Loading...</p>
        </div>
      </main>
    </div>
  );
}
