import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import User from "./User/User";
import Admin from "./Admin/Admin";
import useCookie from "../../hooks/useCookie";

function Mail() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [checkCookieOnBack, setCheckCookieOnBack] = useState(false);
  const [user, setUser] = useState(true);
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
          if (response.data === "1") {
            setUser(false);
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

  return (
    <>
      {isAuthenticated ? (
        user ? (
          <User
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
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
