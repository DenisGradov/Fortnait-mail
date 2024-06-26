const MAX_USERS_ON_PAGE = 9;

import { useEffect, useRef, useState } from "react";
import styles from "./admin.module.scss";
import axios from "axios";
import useCookie from "../../../hooks/useCookie";
import {
  RiArrowLeftCircleFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMessage2Line,
  RiRestartLine,
  RiSearchLine,
} from "react-icons/ri";
import UserLogs from "./UserLogs";
import formatDateOrTime from "../../../functions/formatDateOrTime";
import generatePassword from "../../../functions/generatePassword";
import parseMailInText from "../../../functions/parseMailInText";
import isValidText from "../../../functions/isValidText";
import User from "../User/User";
function Admin({ isAuthenticated, setIsAuthenticated, userEmail }) {
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState({
    state: false,
    changeBun: false,
    id: 0,
    clickForDeleateUser: 0,
    clickForBunUser: 0,
    blocked: 0,
    password: "",
    login: "",
    errorPassword: false,
    errorLogin: false,
  });
  useEffect(() => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      clickForDeleateUser: 0,
      clickForBunUser: 0,
    }));
  }, [userInfo.state, userInfo.id, userInfo.changeBun, userInfo.blocked]);
  const intervalRef = useRef(null);
  const [addUser, setAddUser] = useState({
    state: false,
    email: "",
    admin: false,
    admin2: false,
    admin3: false,
    allData: "",
    login: "",
    password: "",
    emailType: import.meta.env.VITE_EMAIL_DOMEN.split(",").map((domain) =>
      domain.trim()
    )[0],
    errorLogin: false,
    errorEmail: false,
    errorPassword: false,
    errorAllData: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [checkUserMails, setCheckUserMails] = useState({
    state: false,
    userId: 0,
  });
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
    const allData = {
      login: "",
      domain: "",
      password: "",
      email: "",
    };
    if (whear == "emailType") {
      text = addUser.email + "@" + e.target.value;
      whear = "email";
    } else if (whear == "email") {
      text = `${e.target.value}@${addUser.emailType}`;
    } else if (whear == "all") {
      //l.jackson312@kvantomail.com:XOAIiia$mu43
      const data = parseMailInText(e.target.value);
      if (data) {
        allData.login = data.login;
        allData.domain = data.domain;
        allData.password = data.password;
        allData.email = data.email;

        let findDomen = false;
        const domains = import.meta.env.VITE_EMAIL_DOMEN.split(",").map(
          (domain) => domain.trim()
        );
        domains.map((d, index) => {
          if (d == data.domain) {
            console.log(`НАШЕЛ`);
            findDomen = true;
          }
        });
        if (!findDomen) return true;

        text = `${login}@${allData.domain}`;
        whear = "email";
        const newE = { target: { value: data.login } };

        console.log(`Почта ${checkLogin(newE, "email")}`);
        console.log(`Логин  ${checkLogin(newE, "login")}`);
        if (checkLogin(newE, "email") || checkLogin(newE, "login")) {
          console.log("+");
          return true;
        } else {
          console.log("--");
          return false;
        }
      } else {
        console.log("-");
        return true;
      }
    } else {
      text = e.target.value;
    }

    users.forEach((element) => {
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
  function handleCreateUser(withParse) {
    const userAllData = withParse ? parseMailInText(addUser.allData) : "";
    let userPassword = withParse ? userAllData.password : addUser.password;
    let userEmail = withParse
      ? userAllData.email
      : `${addUser.email}@${addUser.emailType}`;
    let userLogin = withParse ? userAllData.login : addUser.login;

    if (withParse && addUser.errorAllData) return false;

    if (
      userPassword.length == 0 ||
      addUser.errorPassword ||
      !isValidText(userPassword) ||
      userPassword.length > 100
    ) {
      setAddUser((prevAddUser) => ({ ...prevAddUser, errorPassword: true }));
      return;
    } else if (
      userEmail.length == 0 ||
      addUser.errorEmail ||
      !isValidText(userEmail) ||
      userEmail.length > 100
    ) {
      setAddUser((prevAddUser) => ({ ...prevAddUser, errorEmail: true }));
      return;
    } else if (
      userLogin.length == 0 ||
      addUser.errorLogin ||
      !isValidText(userPassword) ||
      userLogin.length > 100
    ) {
      setAddUser((prevAddUser) => ({ ...prevAddUser, errorLogin: true }));
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/AddNewUser`, {
        token,
        login,
        loginType,
        newUserEmail: userEmail,
        newUserLogin: userLogin,
        newUserPassword: userPassword,
        adminStatus: withParse
          ? false
          : addUser.admin && addUser.admin2 && addUser.admin3,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data == "good") {
          setAddUser({
            state: false,
            email: "",
            admin: false,
            admin2: false,
            admin3: false,
            login: "",
            password: "",
            allData: "",
            emailType: import.meta.env.VITE_EMAIL_DOMEN.split(",").map(
              (domain) => domain.trim()
            )[0],
            errorLogin: false,
            errorEmail: false,
            errorPassword: false,
            errorAllData: false,
          });
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
    updateUsers(); // Вызываем функцию сразу при монтировании
    intervalRef.current = setInterval(updateUsers, 15000); // Установка интервала на 15 секунд

    return () => clearInterval(intervalRef.current); // Очистка интервала при размонтировании компонента
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
  } //{ isAuthenticated, setIsAuthenticated, userEmail }
  if (checkUserMails.state) {
    return (
      <User
        fromAdmin={true}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userEmail={userEmail}
        userId={checkUserMails.userId}
        setCheckUserMails={setCheckUserMails}
      />
    );
  }

  if (addUser.state) {
    return (
      <div className={styles.wrapperAddUser}>
        <form
          className={styles.wrapperForm}
          onSubmit={(e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение формы
          }}
        >
          <RiArrowLeftCircleFill
            className={styles.back}
            onClick={() =>
              setAddUser({
                state: false,
                email: "",
                admin: false,
                admin2: false,
                admin3: false,
                login: "",
                password: "",
                allData: "",
                emailType: import.meta.env.VITE_EMAIL_DOMEN.split(",").map(
                  (domain) => domain.trim()
                )[0],
                errorLogin: false,
                errorEmail: false,
                errorPassword: false,
                errorAllData: false,
              })
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
                errorEmail:
                  checkLogin(e, "emailType") ||
                  !isValidText(e.target.value) ||
                  e.target.value.length > 100,
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
                errorEmail:
                  checkLogin(e, "email") ||
                  !isValidText(e.target.value) ||
                  e.target.value.length > 100,
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
                errorLogin:
                  checkLogin(e, "login") ||
                  !isValidText(e.target.value) ||
                  e.target.value.length > 100,
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
                errorPassword:
                  !isValidText(e.target.value) || e.target.value.length > 100,
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
          <div className={styles.wrapperForm__checboxBlock}>
            <h2 className={styles.wrapperForm__inputText}>Выдать админку</h2>

            <input
              type="checkbox"
              checked={addUser.admin}
              className={`${styles.wrapperForm__inputcheckbox} `}
              onChange={() => {
                setAddUser((prevInfo) => ({
                  ...prevInfo,
                  admin: !prevInfo.admin,
                }));
              }}
            />
            <input
              type="checkbox"
              checked={addUser.admin2}
              className={`${styles.wrapperForm__inputcheckbox} `}
              onChange={() => {
                setAddUser((prevInfo) => ({
                  ...prevInfo,
                  admin2: !prevInfo.admin2,
                }));
              }}
            />
            <input
              type="checkbox"
              checked={addUser.admin3}
              className={`${styles.wrapperForm__inputcheckbox} `}
              onChange={() => {
                setAddUser((prevInfo) => ({
                  ...prevInfo,
                  admin3: !prevInfo.admin3,
                }));
              }}
            />
          </div>
          <button
            onClick={() => {
              handleCreateUser(false);
            }}
            className={styles.wrapperForm__button}
          >
            Создасть юзера
          </button>
        </form>
        <h2 className={styles.wrapperAddUser__or}>либо</h2>
        <form
          className={styles.wrapperForm}
          onSubmit={(e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение формы
          }}
        >
          <h2 className={styles.wrapperForm__inputText}>
            Введи данные формата email:password
          </h2>
          <input
            value={addUser.allData}
            onChange={(e) => {
              setAddUser((prevInfo) => ({
                ...prevInfo,
                allData: e.target.value,
                errorAllData:
                  e.target.value == ""
                    ? false
                    : checkLogin(e, "all") ||
                      !isValidText(e.target.value) ||
                      e.target.value.length > 200,
              }));
            }}
            className={`${styles.wrapperForm__input} ${
              addUser.errorAllData ? styles.errorData : ""
            }`}
            type="text"
            placeholder="email:password"
          />

          <button
            onClick={() => {
              handleCreateUser(true);
            }}
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
        <RiRestartLine
          onClick={updateUsers}
          className={`${styles.pagination__Icon} ${styles.noSelect} ${styles.pagination__IconCanClick}`}
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
                  changeBun: true,
                  id: user.id,
                  blocked: user.blocked,
                }));
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setCheckUserMails({ state: true, userId: user.id });
              }}
              key={`itemWithUser #${index}`}
              className={styles.user}
            >
              <div className={`${styles.userLogo} ${styles.user__item}`}>
                <img
                  src={user.admin == "1" ? "/god.jpg" : "/mamont.jpg"}
                  className={`${styles.userLogo__img} ${styles.user__item} ${
                    user.blocked == 1
                      ? styles.userLogo__imgRed
                      : styles.userLogo__imgGreen
                  }`}
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
              <div className={`${styles.userLogo} ${styles.user__item}`}>
                <RiMessage2Line
                  title={user.adminMessage}
                  className={
                    user.adminMessage.length > 0
                      ? styles.userLogo__smsImgT
                      : styles.userLogo__smsImg
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;
