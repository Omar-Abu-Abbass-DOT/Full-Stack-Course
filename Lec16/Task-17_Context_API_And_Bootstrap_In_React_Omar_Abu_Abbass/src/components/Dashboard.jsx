import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import UserInfo from "./UserInfo";

function Dashboard() {
  const { userInfo, logout } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const cardClass = theme === "dark" ? "bg-secondary text-light" : "bg-white";

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className={`card p-4 shadow ${cardClass}`} style={{ width: "500px" }}>
        <h2 className="text-center">Dashboard</h2>
        <p className="text-center">
          Welcome, <strong>{userInfo.userName}</strong>!
        </p>

        <UserInfo />

        <button className="btn btn-danger mt-3" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
