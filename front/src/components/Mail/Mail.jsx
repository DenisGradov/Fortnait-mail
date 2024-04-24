import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import User from "./User/User";
import Admin from "./Admin/Admin";

function Mail() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [checkCookieOnBack, setCheckCookieOnBack] = useState(false);
  const [user, setUser] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }
  useEffect(() => {
    const token = getCookie("authToken");
    const login = getCookie("login");
    const loginType = getCookie("type");
    console.log(token);
    if (token) {
      axios
        .post("http://localhost:3000/api/verifyToken", {
          token,
          login,
          loginType,
        })
        .then((response) => {
          setIsAuthenticated(true);
          console.log(response.data);
          if (response.data == "1") {
            setUser(false);
          }
        })
        .catch((error) => {
          console.error("Token validation failed", error);
          setIsAuthenticated(false);
        })
        .finally(() => setCheckCookieOnBack(true));
    } else {
      handleLogout();
    }
  }, []);

  if (!checkCookieOnBack)
    return <div style={{ backgroundColor: "#19191a" }}>Waiting..</div>;

  return <>{user ? <User /> : <Admin />}</>;
}

export default Mail;
