import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { ThemeContext } from "./context/ThemeContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const { isLoggedIn } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={
        theme === "dark"
          ? "bg-dark text-light min-vh-100 p-4"
          : "bg-light text-dark min-vh-100 p-4"
      }
    >
      <div className="container">
        <div className="d-flex justify-content-end mb-3">
          <button
            className={`btn ${theme === "dark" ? "btn-light" : "btn-dark"}`}
            onClick={toggleTheme}
          >
            Toggle Theme ({theme === "dark" ? "Light" : "Dark"})
          </button>
        </div>

        {isLoggedIn ? <Dashboard /> : <Login />}
      </div>
    </div>
  );
}

export default App;
