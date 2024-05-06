/* eslint-disable react/prop-types */
const CLICKS_FOR_DELEATE_USER = 3;
import { useEffect, useMemo, useState } from "react";
import styles from "./admin.module.scss";
import {
  RiArrowLeftCircleFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiRestartLine,
} from "react-icons/ri";
import formatDateOrTime from "../../../functions/formatDateOrTime";
import generatePassword from "../../../functions/generatePassword";
import axios from "axios";
import useCookie from "../../../hooks/useCookie";
const LOGS_PER_PAGE = 10; // Количество логов на странице

// eslint-disable-next-line react/prop-types
function UserLogs({ user, users, setUsers, userInfo, setUserInfo }) {
  const [currentLogPage, setCurrentLogPage] = useState(1);
  const [logSortConfig, setLogSortConfig] = useState({
    key: "timestamp",
    direction: "descending",
  });

  const [logs, setLogs] = useState([]);
  const token = useCookie("authToken");
  const login = useCookie("login");
  const loginType = useCookie("type");
  function checkLogin(e, whear) {
    let find = false;
    let text =
      whear == "email"
        ? `${e.target.value}@${import.meta.env.VITE_EMAIL_DOMEN}`
        : e.target.value;
    users.forEach((element) => {
      console.log(text);
      console.log(element[whear]);
      if (element[whear] == text) {
        find = true;
      }
    });
    return find;
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
  function handleChangeUser() {
    if (userInfo.password.length == 0) {
      setUserInfo((prevAddUser) => ({ ...prevAddUser, errorPassword: true }));
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/changePasswordByAdmin`, {
        token,
        login,
        loginType,
        userId: userInfo.id,
        newUserPassword: userInfo.password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data == "good") {
          alert("Пароль изменен!");
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
  function handleChangeUserLogin() {
    if (userInfo.login.length == 0) {
      setUserInfo((prevAddUser) => ({ ...prevAddUser, errorLogin: true }));
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/changeLoginByAdmin`, {
        token,
        login,
        loginType,
        userId: userInfo.id,
        newUserLogin: userInfo.login,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data == "good") {
          alert("Логин изменен!");

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
  function handleDeleateUser() {
    //CLICKS_FOR_DELEATE_USER
    const newUserInfo = { ...userInfo };
    newUserInfo.clickForDeleateUser++;
    if (newUserInfo.clickForDeleateUser == CLICKS_FOR_DELEATE_USER) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/deleateUser`, {
          token,
          login,
          loginType,
          userId: userInfo.id,
        })
        .then((response) => {
          console.log(response.data);
          if (response.data == "good") {
            setUserInfo((prevUserInfo) => ({ ...prevUserInfo, state: false }));
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
    } else {
      alert(
        `Для удаления юзера нажми на кнопку еще ${
          CLICKS_FOR_DELEATE_USER - newUserInfo.clickForDeleateUser
        } раз(а)`
      );
      setUserInfo(newUserInfo);
    }
  }

  // Парсинг логов с учетом новой структуры
  useEffect(() => {
    if (!user.logs || !Array.isArray(user.logs)) {
      return;
    }

    const newLogs = user.logs
      .map((logArray) => {
        const [timestamp, message, ip, extra] = logArray;
        return { timestamp: new Date(timestamp), message, ip, extra };
      })
      .filter((log) => !isNaN(log.timestamp.getTime())); // Удалить записи с невалидной датой

    setLogs(newLogs);
    console.log("Logs updated:", newLogs);
  }, [user.logs]);
  console.log(logs);
  // Сортировка логов
  const sortedLogs = useMemo(() => {
    return logs.sort((a, b) => {
      return logSortConfig.direction === "descending"
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp;
    });
  }, [logs, logSortConfig]);

  // Вычисление текущих логов для показа
  const indexOfLastLog = currentLogPage * LOGS_PER_PAGE;
  const indexOfFirstLog = indexOfLastLog - LOGS_PER_PAGE;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(sortedLogs.length / LOGS_PER_PAGE);

  // Функции для навигации по страницам
  const goToNextPage = () => {
    setCurrentLogPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentLogPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  console.log(user.logs);
  console.log(logs);
  return (
    <div>
      <div className={styles.wrapper}>
        <RiArrowLeftCircleFill
          className={styles.back}
          onClick={() =>
            setUserInfo((prevSet) => ({ ...prevSet, state: false }))
          }
        />
        <div
          onClick={() => {
            setUserInfo((prevUserInfo) => ({
              ...prevUserInfo,
              state: true,
              id: user.id,
            }));
          }}
          className={`${styles.userOpen} ${styles.user}`}
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
        <div className={styles.wrapperBlock}>
          <div className={styles.wrapperBottom}>
            {" "}
            <h2 className={styles.userOpen__inputText}>Новый пароль юзера</h2>
            <input
              value={userInfo.password}
              onChange={(e) => {
                setUserInfo((prevInfo) => ({
                  ...prevInfo,
                  password: e.target.value,
                }));
              }}
              className={`${styles.userOpen__input} ${
                userInfo.errorPassword ? styles.errorData : ""
              }`}
              type="text"
              placeholder="password"
            />
            <h2
              onClick={() => {
                setUserInfo((prevInfo) => ({
                  ...prevInfo,
                  password: generatePassword(),
                }));
              }}
              className={`${styles.userOpen__inputTextClick} ${styles.noSelect}`}
            >
              рандомный
            </h2>
            <button
              onClick={handleChangeUser}
              className={styles.userOpen__button}
            >
              Изменить юзеру пароль
            </button>
            <h2 className={styles.userOpen__inputText}>Новый логин юзера</h2>
            <input
              value={userInfo.login}
              onChange={(e) => {
                setUserInfo((prevInfo) => ({
                  ...prevInfo,
                  login: e.target.value,
                  errorLogin: checkLogin(e, "login"),
                }));
              }}
              className={`${styles.userOpen__input} ${
                userInfo.errorLogin ? styles.errorData : ""
              }`}
              type="text"
              placeholder="login"
            />
            <button
              onClick={handleChangeUserLogin}
              className={styles.userOpen__button}
            >
              Изменить юзеру логин
            </button>
            {user.admin != 1 ? (
              <button
                onClick={handleDeleateUser}
                className={`${styles.userOpen__button} ${styles.userOpen__buttonRed}`}
              >
                Удалить юзера
              </button>
            ) : (
              ""
            )}
          </div>
          <div className={styles.wrapperBlockLogs}>
            <RiArrowLeftSLine
              onClick={goToPreviousPage}
              className={`${styles.pagination__Icon} ${styles.noSelect} ${
                currentLogPage != 1 ? styles.pagination__IconCanClick : ""
              }`}
            />
            <RiArrowRightSLine
              onClick={goToNextPage}
              className={`${styles.pagination__Icon} ${styles.noSelect} ${
                currentLogPage != totalPages
                  ? styles.pagination__IconCanClick
                  : ""
              }`}
            />
            <RiRestartLine
              onClick={updateUsers}
              className={`${styles.pagination__Icon} ${styles.noSelect} ${styles.pagination__IconCanClick}`}
            />

            <div className={styles.wrapperBlockLogsItems}>
              {currentLogs.map((log, index) => (
                <div className={styles.wrapperBlockLogsItemsItem} key={index}>
                  <p className={styles.wrapperBlockLogsItemsItem__item}>
                    {log.message}
                  </p>
                  <p className={styles.wrapperBlockLogsItemsItem__item}>
                    {log.timestamp.toLocaleString()}
                  </p>
                  <p className={styles.wrapperBlockLogsItemsItem__item}>
                    {log.ip}
                  </p>
                  <p className={styles.wrapperBlockLogsItemsItem__item}>
                    {log.extra}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogs;
