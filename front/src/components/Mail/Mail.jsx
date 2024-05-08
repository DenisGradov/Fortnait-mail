import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import User from "./User/User";
import Admin from "./Admin/Admin";
import useCookie from "../../hooks/useCookie";

function Mail() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [checkCookieOnBack, setCheckCookieOnBack] = useState(false);
  const [user, setUser] = useState({
    status: true,
    email: "",
  });
  const navigate = useNavigate();

  const token = useCookie("authToken");
  const login = useCookie("login");
  const loginType = useCookie("type");
  const handleLogout = () => {
    navigate("/");
  };
  useEffect(() => {
    if (token) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/verifyToken`, {
          token,
          login,
          loginType,
        })
        .then((response) => {
          setIsAuthenticated(true);
          if (response.data.status == "1") {
            setUser({ status: false, email: response.data.email });
            console.log(response.data);
          } else {
            setUser({ status: true, email: response.data.email });
            console.log(response.data);
          }
          setCheckCookieOnBack(true);
        })
        .catch((error) => {
          console.error("Token validation failed", error);
          setIsAuthenticated(false);
          handleLogout();
        });
    } else {
      handleLogout();
    }
  }, []); // Пустой массив зависимостей гарантирует, что запрос выполняется один раз

  if (!checkCookieOnBack)
    return <div style={{ backgroundColor: "#19191a" }}>Waiting..</div>;
  console.log(user);
  return (
    <>
      {isAuthenticated ? (
        user.status ? (
          <User
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            userEmail={user.email}
          />
        ) : (
          <Admin />
        )
      ) : (
        ""
      )}
    </>
  );
}

export default Mail;
