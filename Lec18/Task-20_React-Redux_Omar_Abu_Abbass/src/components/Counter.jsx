import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  reset,
  incrementByAmount,
} from "../store/counterSlice";

function Counter() {
  const [amount, setAmount] = useState("");
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const handleIncrementByAmount = () => {
    const num = Number(amount);
    if (!isNaN(num) && num !== 0) {
      dispatch(incrementByAmount(num));
      setAmount("");
    }
  };

  return (
    <div className="card">
      <h2>Counter</h2>
      <p className="counter-value">{value}</p>
      <div className="btn-group">
        <button onClick={() => dispatch(increment())}>+1</button>
        <button onClick={() => dispatch(decrement())} disabled={value === 0}>
          -1
        </button>
        <button onClick={() => dispatch(reset())} className="btn-reset">
          Reset
        </button>
      </div>
      <div className="amount-group">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleIncrementByAmount}>Add Amount</button>
      </div>
    </div>
  );
}

export default Counter;
