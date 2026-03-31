import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

function UserInfo() {
  const { userInfo } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const cardClass = theme === "dark" ? "bg-secondary text-light" : "bg-light";

  return (
    <div className={`card ${cardClass} mt-3`}>
      <div className="card-body">
        <h5 className="card-title">User Information</h5>
        <ul className="list-group list-group-flush">
          <li className={`list-group-item ${theme === "dark" ? "bg-secondary text-light" : ""}`}>
            <strong>User Name:</strong> {userInfo.userName}
          </li>
          <li className={`list-group-item ${theme === "dark" ? "bg-secondary text-light" : ""}`}>
            <strong>Email:</strong> {userInfo.email}
          </li>
          <li className={`list-group-item ${theme === "dark" ? "bg-secondary text-light" : ""}`}>
            <strong>Phone Number:</strong> {userInfo.phoneNumber}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserInfo;
