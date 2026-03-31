import TodoApp from "./components/TodoApp";
import ApiTodos from "./components/ApiTodos";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Hooks Mastery ⚛️</h1>
        <p>State Management & Side Effects (`useState` & `useEffect`)</p>
      </header>

      <main className="content-grid">
        <TodoApp />
        <ApiTodos />
      </main>
    </div>
  );
}

export default App;