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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    if (token) {
      axios
        .post("http://localhost:5174/api/verifyToken", {
          token,
          login,
          loginType,
        })

        .then((response) => {
          console.log("ssss");
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Token validation failed", error);
          setIsAuthenticated(false);
        });
    }
  }, []);

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
      </Routes>
    </Router>
  );
}

export default App;
