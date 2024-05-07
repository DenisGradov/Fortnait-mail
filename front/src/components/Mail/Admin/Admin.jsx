const MAX_USERS_ON_PAGE = 9;

import { useEffect, useState } from "react";
import styles from "./admin.module.scss";
import axios from "axios";
import useCookie from "../../../hooks/useCookie";
import {
  RiArrowLeftCircleFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSearchLine,
} from "react-icons/ri";
import UserLogs from "./UserLogs";
import formatDateOrTime from "../../../functions/formatDateOrTime";
import generatePassword from "../../../functions/generatePassword";
function Admin() {
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState({
    state: false,
    id: 0,
    clickForDeleateUser: 0,
    password: "",
    login: "",
    errorPassword: false,
    errorLogin: false,
  });
  useEffect(() => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      clickForDeleateUser: 0,
    }));
  }, [userInfo.state, userInfo.id]);
  const [addUser, setAddUser] = useState({
    state: false,
    email: "",
    login: "",
    password: "",
    emailType: import.meta.env.VITE_EMAIL_DOMEN.split(",").map((domain) =>
      domain.trim()
    )[0],
    errorLogin: false,
    errorEmail: false,
    errorPassword: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  function requestSort(key) {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  }

  const filteredSortedUsers = () => {
    let processedUsers = [...users];

    if (sortConfig.key) {
      processedUsers.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Убедимся, что оба значения являются строками перед приведением к нижнему регистру
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA === "none") return 1; // Специальное значение 'none'
        if (valB === "none") return -1;

        if (valA < valB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    if (searchInput) {
      processedUsers = processedUsers.filter(
        (user) =>
          (typeof user.email === "string" &&
            user.email.toLowerCase().includes(searchInput.toLowerCase())) ||
          (typeof user.login === "string" &&
            user.login.toLowerCase().includes(searchInput.toLowerCase()))
      );
    }

    return processedUsers;
  };

  const [searchInput, setSearchInput] = useState("");
  const token = useCookie("authToken");
  const login = useCookie("login");
  const loginType = useCookie("type");
  function checkLogin(e, whear) {
    let find = false;
    let text = "";
    if (whear == "emailType") {
      text = addUser.email + "@" + e.target.value;
      whear = "email";
    } else if (whear == "email") {
      text = `${e.target.value}@${addUser.emailType}`;
    } else {
      text = e.target.value;
    }

    users.forEach((element) => {
      console.log(text);
      console.log(element[whear]);
      if (element[whear] == text) {
        console.log(`${text} ${element[whear]}`);
        find = true;
      }
    });
    return find;
  }

  function handleUpdateInput(e) {
    setSearchInput(e.target.value);
    setCurrentPage(1); // Reset page to 1 when search changes
  }
  const currentUsers = () => {
    const start = (currentPage - 1) * MAX_USERS_ON_PAGE;
    const end = start + MAX_USERS_ON_PAGE;
    return filteredSortedUsers().slice(start, end);
  };

  const totalUsers = filteredSortedUsers().length;
  const totalPages = Math.ceil(totalUsers / MAX_USERS_ON_PAGE);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const nextPage = () => {
    if (canNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (canPrev) {
      setCurrentPage(currentPage - 1);
    }
  };
  console.log(addUser.emailType);
  function handleCreateUser() {
    if (addUser.password.length == 0) {
      setAddUser((prevAddUser) => ({ ...prevAddUser, errorPassword: true }));
      return;
    } else if (addUser.email.length == 0) {
      setAddUser((prevAddUser) => ({ ...prevAddUser, errorEmail: true }));
      return;
    } else if (addUser.login.length == 0) {
      setAddUser((prevAddUser) => ({ ...prevAddUser, errorLogin: true }));
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/AddNewUser`, {
        token,
        login,
        loginType,
        newUserEmail: `${addUser.email}@${addUser.emailType}`,
        newUserLogin: addUser.login,
        newUserPassword: addUser.password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data == "good") {
          setAddUser((prevAddUser) => ({
            ...prevAddUser,
            state: false,
            password: "",
            login: "",
            email: "",
          }));
          setTimeout(updateUsers, 100);
        }
      })
      .catch((error) => {
        console.error("Token validation failed", error);

        if (error.response) {
          if (error.response.status === 401) {
            //setErrorInfo(true);
          }
        }
      });
    console.log("asdasdasd");
  }

  function updateUsers() {
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
  }

  useEffect(() => {
    updateUsers();
  }, []);

  if (userInfo.state) {
    console.log(users);
    let user = users.find((user) => user.id === userInfo.id);
    if (user == undefined) {
      user = users[0];
    }
    console.log(user.id);
    return (
      <UserLogs
        user={user}
        users={users}
        setUsers={setUsers}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
    );
  }
  if (addUser.state) {
    return (
      <div className={styles.wrapper}>
        <form
          className={styles.wrapperForm}
          onSubmit={(e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение формы
          }}
        >
          <RiArrowLeftCircleFill
            className={styles.back}
            onClick={() =>
              setAddUser((prevSet) => ({ ...prevSet, state: false }))
            }
          />
          <h2 className={styles.wrapperForm__inputText}>Выбери почту юзеру</h2>
          <select
            className={styles.wrapperForm__select}
            value={addUser.emailType}
            onChange={(e) => {
              setAddUser((prevInfo) => ({
                ...prevInfo,
                emailType: e.target.value,
                errorEmail: checkLogin(e, "emailType"),
              }));
            }}
            id="languages"
          >
            {import.meta.env.VITE_EMAIL_DOMEN.split(",")
              .map((domain) => domain.trim())
              .map((domain, index) => {
                return (
                  <option key={`option${index}`} value={domain}>
                    {domain}
                  </option>
                );
              })}
          </select>
          <h2 className={styles.wrapperForm__inputText}>
            Эмаил юзера (без @domen.com)
            {
              //{import.meta.env.VITE_EMAIL_DOMEN}
            }
          </h2>
          <input
            value={addUser.email}
            onChange={(e) => {
              setAddUser((prevInfo) => ({
                ...prevInfo,
                email: e.target.value,
                errorEmail: checkLogin(e, "email"),
              }));
            }}
            className={`${styles.wrapperForm__input} ${
              addUser.errorEmail ? styles.errorData : ""
            }`}
            type="text"
            placeholder="email"
          />
          <h2 className={styles.wrapperForm__inputText}>Логин юзера</h2>
          <input
            value={addUser.login}
            onChange={(e) => {
              setAddUser((prevInfo) => ({
                ...prevInfo,
                login: e.target.value,
                errorLogin: checkLogin(e, "login"),
              }));
            }}
            className={`${styles.wrapperForm__input} ${
              addUser.errorLogin ? styles.errorData : ""
            }`}
            type="text"
            placeholder="login"
          />
          <h2 className={styles.wrapperForm__inputText}>Пароль юзера</h2>
          <input
            value={addUser.password}
            onChange={(e) => {
              setAddUser((prevInfo) => ({
                ...prevInfo,
                password: e.target.value,
              }));
            }}
            className={`${styles.wrapperForm__input} ${
              addUser.errorPassword ? styles.errorData : ""
            }`}
            type="text"
            placeholder="password"
          />
          <h2
            onClick={() => {
              setAddUser((prevInfo) => ({
                ...prevInfo,
                password: generatePassword(),
              }));
            }}
            className={`${styles.wrapperForm__inputTextClick} ${styles.noSelect}`}
          >
            рандомный
          </h2>

          <button
            onClick={handleCreateUser}
            className={styles.wrapperForm__button}
          >
            Создасть юзера
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperTop}>
        <h1 className={styles.wrapperTopTitle}>
          Пользователи: <span className={styles.titleNum}>{users.length}</span>
        </h1>
        <button
          onClick={() => {
            setAddUser((prevAddUser) => ({ ...prevAddUser, state: true }));
          }}
          className={styles.wrapperTopButton}
        >
          Добавить пользователя
        </button>
      </div>
      <div className={styles.pagination}>
        <RiArrowLeftSLine
          onClick={prevPage}
          className={`${styles.pagination__Icon} ${styles.noSelect} ${
            canPrev ? styles.pagination__IconCanClick : ""
          }`}
          disabled={!canPrev}
        />
        <RiArrowRightSLine
          onClick={nextPage}
          className={`${styles.pagination__Icon} ${styles.noSelect} ${
            canNext ? styles.pagination__IconCanClick : ""
          }`}
          disabled={!canPrev}
        />
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
      <div className={styles.sortButtons}>
        <h2 className={styles.sortButtons__text}>Сортировка по:</h2>
        <button
          className={styles.sortButtons__button}
          onClick={() => requestSort("id")}
        >
          ID
        </button>
        <button
          className={styles.sortButtons__button}
          onClick={() => requestSort("email")}
        >
          Email
        </button>
        <button
          className={styles.sortButtons__button}
          onClick={() => requestSort("login")}
        >
          Login
        </button>
        <button
          className={styles.sortButtons__button}
          onClick={() => requestSort("lastAsset")}
        >
          Last Asset
        </button>
      </div>
      <div className={styles.wrapperBottom}>
        {currentUsers().map((user, index) => {
          console.log(user);
          return (
            <div
              onClick={() => {
                setUserInfo((prevUserInfo) => ({
                  ...prevUserInfo,
                  state: true,
                  id: user.id,
                }));
              }}
              key={`itemWithUser #${index}`}
              className={styles.user}
            >
              <div className={`${styles.userLogo} ${styles.user__item}`}>
                <img
                  src={user.admin == "1" ? "/god.jpg" : "/mamont.jpg"}
                  className={`${styles.userLogo__img} ${styles.user__item}`}
                />
              </div>
              <h2 className={`${styles.user__text} ${styles.user__item}`}>
                {user.email}
              </h2>
              <h2 className={`${styles.user__text} ${styles.user__item}`}>
                {user.login}
              </h2>
              <h2 className={`${styles.user__text} ${styles.user__item}`}>
                {user.lastAsset == "none"
                  ? "Не заходил"
                  : formatDateOrTime(user.lastAsset)}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;
