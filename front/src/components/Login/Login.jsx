import { useEffect, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

import styles from "./login.module.scss";
import axios from "axios";
function Login({ isAuthenticated, setIsAuthenticated }) {
  const [formData, setFormData] = useState({ login: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

  function setCookie(name, value, years) {
    let expires = "";
    if (years) {
      const date = new Date();
      date.setTime(date.getTime() + years * 24 * 60 * 60 * 1000 * 365);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name +
      "=" +
      (encodeURIComponent(value) || "") +
      expires +
      "; path=/; secure; samesite=strict";
  }
  function handleClickOnButton(event) {
    event.preventDefault();
    const myObject = { formData, checkbox };
    localStorage.setItem("formInfo", JSON.stringify(myObject));
    axios
      .post("http://localhost:5174/api/login", { formData })

      .then((response) => {
        console.log(response.data);
        setCookie("authToken", response.data.token, 7);
        setCookie("login", response.data.login, 7);
        setCookie("type", response.data.type, 7);
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Token validation failed", error);
      });
  }
  function handleOnChangeInputes(e, infoAboutData) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [infoAboutData]: e.target.value,
    }));
  }
  function handleEyeClick() {
    setPasswordVisible(!passwordVisible);
  }
  function handleCheckBoxClick() {
    setCheckbox(!checkbox);
    console.log(checkbox);
  }
  useEffect(() => {
    const formInfo = localStorage.getItem("formInfo");
    const formInfoObject = JSON.parse(formInfo);
    if (formInfoObject != null) {
      setCheckbox(formInfoObject.checkbox);
      setFormData(formInfoObject.formData);
    }
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.loginForm}>
        <h1 className={styles.loginForm__title}>Sign In</h1>
        <h2 className={styles.loginForm__description}>to continue</h2>
        <form className={styles.loginFormForm}>
          <input
            className={styles.loginFormForm__input}
            type="text"
            value={formData.login}
            onChange={(e) => handleOnChangeInputes(e, "login")}
            name="login"
            id="login"
            placeholder="Login"
          />
          <div className={styles.loginFormFormPassword}>
            <input
              className={styles.loginFormFormPassword__input}
              type={passwordVisible ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleOnChangeInputes(e, "password")}
              name="login"
              id="login"
              placeholder="Password"
            />
            {passwordVisible ? (
              <RiEyeLine
                className={styles.loginFormFormPassword__yey}
                onClick={handleEyeClick}
              />
            ) : (
              <RiEyeOffLine
                className={styles.loginFormFormPassword__yey}
                onClick={handleEyeClick}
              />
            )}
          </div>
          <div className={styles.loginFormFormSavebox}>
            <input
              className={styles.customCheckbox}
              type="checkbox"
              name="saveLoginInfo"
              id="saveLoginInfo"
              checked={checkbox}
              onChange={(e) => handleCheckBoxClick(e)}
            />
            <h2
              className={styles.loginFormFormSavebox__text}
              onClick={handleCheckBoxClick}
            >
              Save
            </h2>
          </div>
          <button
            onClick={handleClickOnButton}
            className={styles.loginFormForm__button}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
