import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    totalIncrements: 0,
    totalDecrements: 0,
    history: [],
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
      state.totalIncrements += 1;
      state.history.push({ type: "increment", change: 1 });
    },
    decrement: (state) => {
      state.value -= 1;
      state.totalDecrements += 1;
      state.history.push({ type: "decrement", change: -1 });
    },
    reset: (state) => {
      const oldValue = state.value;
      state.value = 0;
      state.history.push({ type: "reset", change: -oldValue });
    },
    incrementByAmount: (state, action) => {
      const amount = action.payload;
      state.value += amount;
      state.totalIncrements += 1;
      state.history.push({ type: "incrementByAmount", change: amount });
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { increment, decrement, reset, incrementByAmount, clearHistory } =
  counterSlice.actions;
export default counterSlice.reducer;
