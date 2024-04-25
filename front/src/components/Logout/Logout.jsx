import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  function deleteCookie(name) {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  const handleLogout = async () => {
    await deleteCookie("authToken");
    await deleteCookie("type");
    await deleteCookie("login");
    setIsAuthenticated(false);
    navigate("/");
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <div>Виходите з системи...</div>;
}

export default Logout;
