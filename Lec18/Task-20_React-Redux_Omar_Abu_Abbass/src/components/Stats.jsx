import { useSelector } from "react-redux";

function Stats() {
  const { totalIncrements, totalDecrements } = useSelector(
    (state) => state.counter
  );

  return (
    <div className="card">
      <h2>Stats</h2>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-label">Total Increments</span>
          <span className="stat-value increment">{totalIncrements}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Decrements</span>
          <span className="stat-value decrement">{totalDecrements}</span>
        </div>
      </div>
    </div>
  );
}

export default Stats;
