/* eslint-disable react/prop-types */
const CLICK_TO_DELEATE_MESSAGE = 2;
import { useEffect, useRef, useState } from "react";
import styles from "./user.module.scss";
import axios from "axios";
import {
  RiArrowLeftCircleFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBin6Line,
  RiRestartLine,
  RiSearchLine,
  RiSettings3Line,
} from "react-icons/ri";
import DOMPurify from "dompurify";
import UserSettings from "../UserSettings/UserSettings";
import useCookie from "../../../hooks/useCookie";
import SendMail from "../../SendMail/SendMail";
import NotWorking from "../../NotWorking/NotWorking";

function User({
  fromAdmin,
  isAuthenticated,
  setIsAuthenticated,
  userEmail,
  userId,
  setCheckUserMails,
}) {
  const [posts, setPosts] = useState({ sent: [], received: [] });
  const [sendMail, setSendMail] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const intervalRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [chooseMail, setChooseMail] = useState({
    id: 0,
    clickToDeleate: 0,
  });
  const [mailOnScreen, setMailOnScreen] = useState({
    numerPage: 0,
    mailOpen: false,
    element: 0,
  });

  const token = useCookie("authToken");
  const login = useCookie("login");
  const loginType = useCookie("type");

  function handleDeleateMessage(id) {
    const newChooseMail = { ...chooseMail };
    if (newChooseMail.id == id) {
      newChooseMail.clickToDeleate++;
    } else {
      newChooseMail.id = id;
      newChooseMail.clickToDeleate = 0;
      newChooseMail.clickToDeleate++;
    }
    if (newChooseMail.clickToDeleate == CLICK_TO_DELEATE_MESSAGE) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/deleatePost`, {
          token,
          login,
          loginType,
          id,
        })
        .then((response) => {
          let newPosts = response.data;
          newPosts.received = newPosts.received.reverse();

          setChooseMail((prevInfo) => ({
            ...prevInfo,
            id: 0,
            clickToDeleate: 0,
          }));
          setPosts(newPosts);
          setMailOnScreen((prevSet) => ({ ...prevSet, mailOpen: false }));
        })
        .catch((error) => {
          console.error("Error when send posts", error);
          setIsAuthenticated(false);
        });
    } else {
      setChooseMail((prevInfo) => ({
        ...prevInfo,
        id: newChooseMail.id,
        clickToDeleate: newChooseMail.clickToDeleate,
      }));
      alert("Are you sure? Click again to confirm");
    }
  }

  function handleOpenMail(element) {
    if (!element.viewed && !fromAdmin) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/checkPost`, {
          token,
          login,
          loginType,
          element,
        })
        .then((response) => {
          let newPosts = response.data;
          newPosts.received = newPosts.received.reverse();

          setPosts(newPosts);
        })
        .catch((error) => {
          console.error("Error when send posts", error);
          setIsAuthenticated(false);
        });
    }
    setMailOnScreen((prevSet) => ({
      ...prevSet,
      mailOpen: true,
      element,
    }));
  }

  const getMailRange = () => {
    const totalPosts = filteredPosts.length;
    const currentPage = mailOnScreen.numerPage;
    const startIndex = currentPage * postsPerPage + 1;
    let endIndex = startIndex + postsPerPage - 1;
    if (endIndex > totalPosts) {
      endIndex = totalPosts;
    }
    return `${startIndex}-${endIndex} of ${totalPosts}`;
  };

  const totalPosts = posts.received.length;
  const postsPerPage = 50;
  const maxPage = Math.ceil(totalPosts / postsPerPage) - 1;
  useEffect(() => {
    intervalRef.current = setInterval(getPosts, 15000); // Установка интервала на 15 секунд

    return () => clearInterval(intervalRef.current); // Очистка интервала
  }, []);
  function getPosts() {
    if (token) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/getPosts`, {
          token,
          login,
          loginType,
          fromAdmin: fromAdmin ? true : false,
          userId: userId ? userId : false,
        })
        .then((response) => {
          let newPosts = response.data;
          newPosts.received = newPosts.received.reverse();

          setPosts(newPosts);
          setFilteredPosts(newPosts.received);
        })
        .catch((error) => {
          console.error("Token validation failed", error);
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }
  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const results = posts.received.filter(
      (item) =>
        (item.text &&
          item.text.toLowerCase().includes(searchInput.toLowerCase())) ||
        (item.sender &&
          item.sender.toLowerCase().includes(searchInput.toLowerCase())) ||
        (item.subject &&
          item.subject.toLowerCase().includes(searchInput.toLowerCase()))
    );
    setFilteredPosts(results);
    setMailOnScreen((prev) => ({ ...prev, numerPage: 0 }));
  }, [searchInput, posts.received]);
  useEffect(() => {
    const totalFilteredPosts = filteredPosts.length;
    const maxPage = Math.ceil(totalFilteredPosts / postsPerPage) - 1;

    // Установить текущую страницу на последнюю, если текущая страница теперь за пределами диапазона
    if (mailOnScreen.numerPage > maxPage) {
      setMailOnScreen((prev) => ({
        ...prev,
        numerPage: maxPage >= 0 ? maxPage : 0,
      }));
    }
  }, [filteredPosts, mailOnScreen.numerPage]);

  function handleUpdateInput(e) {
    setSearchInput(e.target.value);
  }
  function formatDateWithUserTimezone(timestamp) {
    // Получение часового пояса пользователя
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Создание объекта даты
    const date = new Date(timestamp);

    // Возвращение строки даты в формате "12 April 12:34", с учетом часового пояса пользователя
    return date.toLocaleString("en-US", {
      timeZone: timeZone,
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  const formatDateOrTime = (itemDate) => {
    itemDate = new Date(itemDate); // Convert itemDate to a Date object
    const now = new Date();
    const diff = now - itemDate; // Difference in milliseconds
    const hours = Math.floor(diff / 3600000); // Convert to hours

    if (hours < 24) {
      const minutes = Math.floor((diff % 3600000) / 60000); // Remaining minutes
      return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
    } else {
      return `${itemDate.getDate()} ${itemDate.toLocaleString("en", {
        month: "long",
      })}`;
    }
  };
  if (sendMail) {
    //return <NotWorking setSendMail={setSendMail} />;
    return <SendMail setSendMail={setSendMail} />;
  }
  if (mailOnScreen.mailOpen) {
    const item = mailOnScreen.element;
    const cleanHTML = DOMPurify.sanitize(mailOnScreen.element.html);
    return (
      <div className={styles.wrapper}>
        <RiArrowLeftCircleFill
          className={styles.back}
          onClick={() =>
            setMailOnScreen((prevSet) => ({ ...prevSet, mailOpen: false }))
          }
        />
        <div className={styles.wrapperListInfo}>
          <div
            onClick={() => {
              handleOpenMail(item);
            }}
            className={`${styles.bottomBoxWithReceivedItem} ${
              item.viewed
                ? styles.bottomBoxWithReceivedItem__viewed
                : styles.bottomBoxWithReceivedItem__notViewed
            }`}
          >
            <RiDeleteBin6Line
              onClick={(event) => {
                event.stopPropagation(); // Запобігає спливанню події
                if (!fromAdmin) handleDeleateMessage(item.id);
              }}
              className={styles.bottomBoxWithReceivedItem__elementIcon}
            />
            <h2 className={styles.bottomBoxWithReceivedItem__element}>
              {item.sender.length > 35
                ? item.sender.slice(0, 35) + "..."
                : item.sender}
            </h2>
            <h2 className={styles.bottomBoxWithReceivedItem__element}>
              {item.subject.length > 35
                ? item.subject.slice(0, 35) + "..."
                : item.subject}
            </h2>
            <h2 className={styles.bottomBoxWithReceivedItem__element}>
              {item.text
                ? item.text.length > 95
                  ? item.text.slice(0, 95) + "..."
                  : item.text
                : ""}
            </h2>
            <h2 className={styles.bottomBoxWithReceivedItem__element}>
              {formatDateWithUserTimezone(item.date)}
            </h2>
          </div>
        </div>
        <div className={styles.wrapperMail}>
          <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          {fromAdmin && (
            <RiArrowLeftCircleFill
              className={styles.back2}
              onClick={() =>
                setCheckUserMails((prevSet) => ({ ...prevSet, state: false }))
              }
            />
          )}
          {!fromAdmin && (
            <h2
              onClick={() => {
                setSendMail(true);
              }}
              className={`${styles.top__send} ${styles.noSelect}`}
            >
              Send mail
            </h2>
          )}

          <RiRestartLine
            onClick={getPosts}
            className={`${styles.pagination__Icon} ${styles.noSelect} ${styles.pagination__IconCanClick}`}
          />
          <div className={styles.topMenuSearch}>
            <input
              value={searchInput}
              onChange={(e) => {
                handleUpdateInput(e);
              }}
              className={styles.topMenuSearch__input}
              placeholder="Search mail"
            />
            <RiSearchLine className={styles.topMenuSearch__icon} />
          </div>
          {!fromAdmin && (
            <RiSettings3Line
              onClick={() => {
                setSettingsOpen(true);
              }}
              className={styles.topMenuSettings}
            />
          )}
        </div>
        <div className={styles.NumberMails}>
          <h2 className={`${styles.noSelect} ${styles.NumberMailsNumer}`}>
            {getMailRange()}
          </h2>
          <RiArrowLeftSLine
            onClick={() => {
              if (mailOnScreen.numerPage > 0) {
                setMailOnScreen((prevSet) => ({
                  ...prevSet,
                  numerPage: prevSet.numerPage - 1,
                }));
              }
            }}
            className={`${styles.noSelect} ${styles.NumberMailsIcon} ${
              mailOnScreen.numerPage > 0
                ? styles.NumberMailsIconCanClick
                : false
            }`}
          />
          <RiArrowRightSLine
            onClick={() => {
              if (mailOnScreen.numerPage < maxPage) {
                setMailOnScreen((prevSet) => ({
                  ...prevSet,
                  numerPage: prevSet.numerPage + 1,
                }));
              }
            }}
            className={`${styles.noSelect} ${styles.NumberMailsIcon} ${
              mailOnScreen.numerPage < maxPage
                ? styles.NumberMailsIconCanClick
                : false
            }`}
          />
        </div>
        <div className={styles.bottomBoxWithReceived}>
          {posts.received
            .filter(
              (item) =>
                !searchInput.trim() ||
                (item.text &&
                  item.text
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())) ||
                (item.sender &&
                  item.sender
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())) ||
                (item.subject &&
                  item.subject
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()))
            )
            .map((item, index) => {
              const postsPerPage = 50;
              const currentPage = mailOnScreen.numerPage;
              const startIndex = currentPage * postsPerPage;
              const endIndex = startIndex + postsPerPage;
              if (item == undefined) return false;
              // Only proceed if the post's index is within the range of the current page
              if (index >= startIndex && index < endIndex) {
                return (
                  <div
                    key={`received mail ${index}`}
                    onClick={() => {
                      handleOpenMail(item);
                    }}
                    className={`${styles.bottomBoxWithReceivedItem} ${
                      item.viewed
                        ? styles.bottomBoxWithReceivedItem__viewed
                        : styles.bottomBoxWithReceivedItem__notViewed
                    }`}
                  >
                    <RiDeleteBin6Line
                      onClick={(event) => {
                        event.stopPropagation(); // Запобігає спливанню події
                        if (!fromAdmin) handleDeleateMessage(item.id);
                      }}
                      className={styles.bottomBoxWithReceivedItem__elementIcon}
                    />

                    <h2 className={styles.bottomBoxWithReceivedItem__element}>
                      {item.sender.length > 35
                        ? item.sender.slice(0, 35) + "..."
                        : item.sender}
                    </h2>
                    <h2 className={styles.bottomBoxWithReceivedItem__element}>
                      {item.subject.length > 35
                        ? item.subject.slice(0, 35) + "..."
                        : item.subject}
                    </h2>
                    <h2 className={styles.bottomBoxWithReceivedItem__element}>
                      {item.text
                        ? item.text.length > 95
                          ? item.text.slice(0, 95) + "..."
                          : item.text
                        : ""}
                    </h2>
                    <h2 className={styles.bottomBoxWithReceivedItem__element}>
                      {formatDateOrTime(item.date)}
                    </h2>
                  </div>
                );
              }
            })}
        </div>
      </div>
      {settingsOpen && (
        <UserSettings
          setSettingsOpen={setSettingsOpen}
          setIsAuthenticated={setIsAuthenticated}
          userEmail={userEmail}
        />
      )}

      <h2 className={styles.headerAdminMessageBig}>
        {fromAdmin
          ? "Вы просматриваете почту "
          : "Have a question? Write by email "}
        <span className={styles.headerAdminMessageBlue}>
          {fromAdmin ? "юзера" : "admin@kvantomail.com"}
        </span>
      </h2>

      <h2 className={styles.headerAdminMessageSmall}>
        {fromAdmin ? "Почта " : "Questions? "}
        <span className={styles.headerAdminMessageBlue}>
          {fromAdmin ? "юзера" : "admin@kvantomail.com"}
        </span>
      </h2>
    </>
  );
}

export default User;
