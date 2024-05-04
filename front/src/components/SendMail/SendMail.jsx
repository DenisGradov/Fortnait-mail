import { useState } from "react";
import styles from "./sendMail.module.scss";
import { RiArrowLeftCircleFill } from "react-icons/ri";
import axios from "axios";
import useCookie from "../../hooks/useCookie";
import { useNavigate } from "react-router-dom";

function SendMail({ setSendMail }) {
  const [sendMailInfo, setSendMailInfo] = useState({
    to: "",
    subject: "",
    text: "",
  });
  const token = useCookie("authToken");
  const login = useCookie("login");
  const loginType = useCookie("type");
  const navigate = useNavigate();
  function handleButtonClick() {
    axios
      .post("https://kvantomail.com/api/SendMail", {
        token,
        login,
        loginType,
        to: sendMailInfo.to,
        subject: sendMailInfo.subject,
        text: sendMailInfo.text,
      })
      .then((response) => {
        if (response.data == "send") {
          navigate("/mail");
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
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperForm}>
        <RiArrowLeftCircleFill
          className={styles.back}
          onClick={() => {
            setSendMail(false);
          }}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Предотвращаем стандартное поведение формы
            handleButtonClick();
          }}
        >
          <h2 className={styles.wrapperForm__inputText}>Enter to whom:</h2>
          <input
            value={sendMailInfo.new}
            onChange={(e) => {
              setSendMailInfo((prevInfo) => ({
                ...prevInfo,
                to: e.target.value,
              }));
            }}
            className={styles.wrapperForm__input}
            type="text"
            placeholder="To whom"
            onSubmit={handleButtonClick}
          />
          <h2 className={styles.wrapperForm__inputText}>Enter subject:</h2>
          <input
            value={sendMailInfo.subject}
            onChange={(e) => {
              setSendMailInfo((prevInfo) => ({
                ...prevInfo,
                subject: e.target.value,
              }));
            }}
            className={styles.wrapperForm__input}
            type="text"
            placeholder="Subject"
            onSubmit={handleButtonClick}
          />
          <h2 className={styles.wrapperForm__inputText}>
            Enter text of letter:
          </h2>
          <textarea
            value={sendMailInfo.text}
            onChange={(e) => {
              setSendMailInfo((prevInfo) => ({
                ...prevInfo,
                text: e.target.value,
              }));
            }}
            className={styles.wrapperForm__textarea}
            type="text"
            placeholder="Text"
            onSubmit={handleButtonClick}
          />
          <button
            onClick={handleButtonClick}
            className={styles.wrapperForm__button}
          >
            Send mail
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendMail;
