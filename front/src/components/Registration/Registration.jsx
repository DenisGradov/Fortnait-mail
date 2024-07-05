import { useEffect, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styles from "./registration.module.scss";
import axios from "axios";

function Registration({ isAuthenticated, setIsAuthenticated }) {
    const [formData, setFormData] = useState({ login: "", email: "", password: "" });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [checkbox, setCheckbox] = useState(false);
    const [errorInfo, setErrorInfo] = useState(false);
    const [capcha, setCapcha] = useState([
        Math.floor(Math.random() * 50) + 1,
        Math.floor(Math.random() * 50) + 1,
        Math.floor(Math.random() * 2) + 1,
        "",
    ]);
    const navigate = useNavigate();

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

    function validateFormData(data) {
        const englishOnly = /^[A-Za-z0-9]+$/;
        return englishOnly.test(data.login) && englishOnly.test(data.email) && englishOnly.test(data.password);
    }

    function handleClickOnButton(event) {
        event.preventDefault();
        if (!validateFormData(formData)) {
            alert("Please use only English letters and numbers in your login, email, and password.");
            return;
        }

        if (
            capcha[2] === 1
                ? capcha[0] + capcha[1] !== parseInt(capcha[3])
                : capcha[0] - capcha[1] !== parseInt(capcha[3])
        ) {
            alert("Captcha solved incorrectly");
            return;
        }

        const myObject = { formData, checkbox };
        localStorage.setItem("formInfo", JSON.stringify(myObject));
        axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/api/registration`, { formData })
            .then((response) => {
                console.log(response);
                setCookie("authToken", response.data.token, 7);
                setCookie("login", response.data.login, 7);
                setCookie("type", response.data.type, 7);
                setIsAuthenticated(true);
                navigate("/mail"); // Редирект на страницу почты после успешной регистрации
            })
            .catch((error) => {
                console.error("Token validation failed", error);
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorInfo(true);
                    } else if (error.response.status === 400) {
                        alert(error.response.data.error);
                    }
                }
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
        <>
            <div className={styles.wrapper}>
                <div className={styles.loginForm}>
                    <h1 className={styles.loginForm__title}>
                        Registration <span><a className={styles.headerAdminMessageBlue} href="../">or login</a></span>
                    </h1>
                    <h2 className={styles.loginForm__description}>to continue</h2>
                    <form className={styles.loginFormForm}>
                        <h2 className={styles.loginFormForm__description}>Email (without @...):</h2>
                        <div className={styles.registerMailInputs}>
                            <input
                                className={`${styles.loginFormForm__input} ${errorInfo ? styles.errorData : ''}`}
                                type="text"
                                value={formData.email}
                                onChange={(e) => handleOnChangeInputes(e, "email")}
                                name="email"
                                id="email"
                                placeholder="Email"
                            />
                            <h2 className={styles.registerMailInputs__text}>@kvantomail.com</h2>
                        </div>
                        <h2 className={styles.loginFormForm__description}>Login</h2>
                        <div className={styles.registerMailInputs}>
                            <input
                                className={`${styles.loginFormForm__input} ${errorInfo ? styles.errorData : ''}`}
                                type="text"
                                value={formData.login}
                                onChange={(e) => handleOnChangeInputes(e, "login")}
                                name="login"
                                id="login"
                                placeholder="Login"
                            />
                        </div>
                        <h2 className={styles.loginFormForm__description}>Password</h2>
                        <div className={styles.loginFormFormPassword}>
                            <input
                                className={`${styles.loginFormFormPassword__input} ${errorInfo ? styles.errorData : ''}`}
                                type={passwordVisible ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleOnChangeInputes(e, "password")}
                                name="password"
                                id="password"
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
                                onChange={handleCheckBoxClick}
                            />
                            <h2
                                className={styles.loginFormFormSavebox__text}
                                onClick={handleCheckBoxClick}
                            >
                                Save
                            </h2>
                        </div>
                        <div className={styles.loginFormCapchaBox}>
                            <h2 className={styles.loginFormCapchaBox__text}>{`${capcha[0]} ${
                                capcha[2] === 1 ? "+" : "-"
                            } ${capcha[1]}`}</h2>
                            <h2 className={styles.loginFormCapchaBox__text}>=</h2>
                            <input
                                value={capcha[3]}
                                onChange={(e) => {
                                    setCapcha((prevValue) => ({
                                        ...prevValue,
                                        [3]: e.target.value,
                                    }));
                                }}
                                className={styles.loginFormCapchaBox__input}
                            />
                        </div>
                        <button
                            onClick={handleClickOnButton}
                            className={styles.loginFormForm__button}
                        >
                            Registration
                        </button>
                    </form>
                </div>
            </div>

            <h2 className={styles.headerAdminMessageBig}>
                Have a question? Write by email{" "}
                <span className={styles.headerAdminMessageBlue}>admin@kvantomail.com</span>
            </h2>
            <h2 className={styles.headerAdminMessageSmall}>
                Question? <span className={styles.headerAdminMessageBlue}>admin@kvantomail.com</span>
            </h2>
        </>
    );
}

export default Registration;
