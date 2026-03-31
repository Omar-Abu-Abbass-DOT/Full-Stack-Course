import { useState } from "react";
import { UserContext } from "./UserContext";

function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const login = (info) => {
    setUserInfo(info);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserInfo({ userName: "", email: "", phoneNumber: "", password: "" });
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, userInfo, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
