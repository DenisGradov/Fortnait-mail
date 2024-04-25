import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import axios from "axios";

import "./App.css";

import Login from "./components/Login/Login";
import Mail from "./components/Mail/Mail";
import Logout from "./components/Logout/Logout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [checkCookieOnBack, setCheckCookieOnBack] = useState(false);
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
        })
        .catch((error) => {
          console.error("Token validation failed", error);
          setIsAuthenticated(false);
        })
        .finally(() => setCheckCookieOnBack(true));
    } else {
      setIsAuthenticated(false);
      setCheckCookieOnBack(true);
    }
  }, []);

  if (!checkCookieOnBack)
    return <div style={{ backgroundColor: "#19191a" }}>Waiting..</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/mail" />
            ) : (
              <Login
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            )
          }
        />
        <Route path="/mail" element={<Mail />} />
        <Route
          path="/logout"
          element={
            <Logout
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
