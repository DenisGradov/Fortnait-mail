import { useEffect, useState } from "react";
import styles from "./admin.module.scss";
import axios from "axios";
import useCookie from "../../../hooks/useCookie";
import { RiSearchLine } from "react-icons/ri";
function Admin() {
  const [users, setUsers] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const token = useCookie("authToken");
  const login = useCookie("login");
  const loginType = useCookie("type");
  function handleUpdateInput(e) {
    setSearchInput(e.target.value);
  }
  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/getUsers`, {
        token,
        login,
        loginType,
      })
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error when send posts", error);
      });
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperTop}>
        <h1 className={styles.wrapperTopTitle}>
          Пользователи: <span className={styles.titleNum}>{users.length}</span>
        </h1>
        <div className={styles.wrapperTopInput}>
          <input
            value={searchInput}
            onChange={(e) => {
              handleUpdateInput(e);
            }}
            className={styles.wrapperTopInput__input}
            placeholder="Поиск юзера"
          />
          <RiSearchLine className={styles.wrapperTopInput__icon} />
        </div>
      </div>
    </div>
  );
}

export default Admin;
