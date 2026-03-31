import { useSelector, useDispatch } from "react-redux";
import { clearHistory } from "../store/counterSlice";

function History() {
  const history = useSelector((state) => state.counter.history);
  const dispatch = useDispatch();

  return (
    <div className="card">
      <div className="history-header">
        <h2>History</h2>
        {history.length > 0 && (
          <button
            onClick={() => dispatch(clearHistory())}
            className="btn-clear"
          >
            Clear History
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="empty">No actions yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((entry, index) => (
            <li key={index} className={`history-item ${entry.type}`}>
              <span className="history-type">{entry.type}</span>
              <span className="history-change">
                {entry.change >= 0 ? `+${entry.change}` : entry.change}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;
