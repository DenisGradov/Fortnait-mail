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
import useCookie from "./hooks/useCookie";
import {MdAppRegistration} from "react-icons/md";
import Registration from "./components/Registration/Registration.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [checkCookieOnBack, setCheckCookieOnBack] = useState(false);

  const token = useCookie("authToken");
  const login = useCookie("login");
  const loginType = useCookie("type");
  console.log(import.meta.env.VITE_BACKEND_URL);
  useEffect(() => {
    console.log(token);
    if (token) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/verifyToken`, {
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
        <Route path="/registration" element={
            <Registration
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
            />
        } />
        <Route
          path="/logout"
          element={
            <Logout
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              setCheckCookieOnBack={setCheckCookieOnBack}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
