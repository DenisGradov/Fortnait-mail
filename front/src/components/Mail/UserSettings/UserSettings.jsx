import { useState } from "react";
import styles from "./userSettings.module.scss";
import { RiArrowLeftCircleFill, RiFileCopyLine } from "react-icons/ri";
import axios from "axios";
import useCookie from "../../../hooks/useCookie";
import { useNavigate } from "react-router-dom";
import copyTextToClipboard from "../../../functions/copyTextToClipboard";
function UserSettings({ setSettingsOpen, setIsAuthenticated, userEmail }) {
  const [passwords, setPasswords] = useState({ old: "", new: "" });

  const [errorInfo, setErrorInfo] = useState(false);
  const token = useCookie("authToken");
  const login = useCookie("login");
  const loginType = useCookie("type");

  const navigate = useNavigate();
  function handleButtonClick() {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/ChangePassword`, {
        token,
        login,
        loginType,
        oldPassword: passwords.old,
        newPassword: passwords.new,
      })
      .then((response) => {
        if (response.data == "password change") {
          console.log("asdasd");
          setIsAuthenticated(false);
          navigate("/logout");
        }
      })
      .catch((error) => {
        console.error("Token validation failed", error);

        if (error.response) {
          if (error.response.status === 401) {
            setErrorInfo(true);
          }
        }
      });
  }
  console.log(userEmail);
  return (
    <div className={styles.wrapper}>
      <div className={styles.loginForm}>
        <div className={styles.loginFormInput}>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Предотвращаем стандартное поведение формы
              handleButtonClick();
            }}
          >
            <RiArrowLeftCircleFill
              className={styles.back}
              onClick={() => {
                setSettingsOpen(false);
              }}
            />
            <h2 className={styles.loginFormInput__inputText}>Your email is:</h2>
            <h2 className={styles.loginFormInput__inputTextEmail}>
              <RiFileCopyLine
                onClick={copyTextToClipboard(userEmail)}
                className={styles.loginFormInput__inputTextEmailIcon}
              />
              <span
                onClick={copyTextToClipboard(userEmail)}
                className={styles.loginFormInput__inputTextEmailText}
              >
                {userEmail}
              </span>
            </h2>
            <h2 className={styles.loginFormInput__inputTextHelp}>
              (click on mail to copy)
            </h2>
            <h2 className={styles.loginFormInput__inputText}>
              Enter your password:
            </h2>
            <input
              value={passwords.old}
              onChange={(e) => {
                setPasswords((prevPasswords) => ({
                  ...prevPasswords,
                  old: e.target.value,
                }));
              }}
              className={`${styles.loginFormInput__input} ${
                errorInfo ? styles.errorData : false
              }`}
              type="password"
              placeholder="Your password"
              onSubmit={handleButtonClick}
            />
            <h2 className={styles.loginFormInput__inputText}>
              Enter your new password:
            </h2>
            <input
              value={passwords.new}
              onChange={(e) => {
                if (e.target.value.length < 100)
                  setPasswords((prevPasswords) => ({
                    ...prevPasswords,
                    new: e.target.value,
                  }));
              }}
              className={styles.loginFormInput__input}
              type="password"
              placeholder="New password"
              onSubmit={handleButtonClick}
            />
            <button
              onClick={handleButtonClick}
              className={styles.loginFormInput__button}
            >
              Change password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
