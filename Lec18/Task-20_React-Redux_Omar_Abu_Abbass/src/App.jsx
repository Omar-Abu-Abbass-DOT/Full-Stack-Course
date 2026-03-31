import Counter from "./components/Counter";
import Stats from "./components/Stats";
import History from "./components/History";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Redux Counter</h1>
      <div className="layout">
        <Counter />
        <Stats />
        <History />
      </div>
    </div>
  );
}

export default App;
