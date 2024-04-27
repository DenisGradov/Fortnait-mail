import { useEffect, useState } from "react";
import styles from "./User.module.scss";
import axios from "axios";
import {
  RiArrowLeftCircleFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSearchLine,
  RiSettings3Line,
} from "react-icons/ri";
import DOMPurify from "dompurify";
function User({ isAuthenticated, setIsAuthenticated }) {
  const [posts, setPosts] = useState({ sent: [], received: [] });
  const [searchInput, setSearchInput] = useState("");
  const [mailOnScreen, setMailOnScreen] = useState({
    numerPage: 0,
    mailOpen: false,
    element: 0,
  });
  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }
  function handleOpenMail(element) {
    console.log(element.viewed);
    if (!element.viewed) {
      console.log("sss2");
      const token = getCookie("authToken");
      const login = getCookie("login");
      const loginType = getCookie("type");

      axios
        .post("http://localhost:3000/api/checkPost", {
          token,
          login,
          loginType,
          element: mailOnScreen.element,
        })
        .then((response) => {
          let newPosts = response.data;
          console.log(newPosts);
          newPosts.received = newPosts.received.reverse();
          for (let i = 0; i < 225; i++) {
            newPosts.received.push(newPosts.received[0]);
          }
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
    const currentPage = mailOnScreen.numerPage;

    // Calculate start index of posts for current page
    const startIndex = currentPage * postsPerPage + 1;

    // Calculate end index for current page
    let endIndex = startIndex + postsPerPage - 1;

    // If the calculated end index exceeds the total number of posts, adjust it to totalPosts
    if (endIndex > totalPosts) {
      endIndex = totalPosts;
    }

    // Return the formatted string
    return `${startIndex}-${endIndex} of ${totalPosts}`;
  };
  const totalPosts = posts.received.length;
  const postsPerPage = 50;
  const maxPage = Math.ceil(totalPosts / postsPerPage) - 1;
  useEffect(() => {
    const token = getCookie("authToken");
    const login = getCookie("login");
    const loginType = getCookie("type");

    if (token) {
      axios
        .post("http://localhost:3000/api/getPosts", {
          token,
          login,
          loginType,
        })
        .then((response) => {
          let newPosts = response.data;
          newPosts.received = newPosts.received.reverse();
          for (let i = 0; i < 225; i++) {
            newPosts.received.push(newPosts.received[0]);
          }
          setPosts(newPosts);
        })
        .catch((error) => {
          console.error("Token validation failed", error);
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  console.log(posts.received);
  function handleUpdateInput(e) {
    setSearchInput(e.target.value);
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
        </div>
        <div className={styles.wrapperMail}>
          <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <h2 className={`${styles.top__send} ${styles.noSelect}`}>Send mail</h2>

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
        <RiSettings3Line className={styles.topMenuSettings} />
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
            mailOnScreen.numerPage > 0 ? styles.NumberMailsIconCanClick : false
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
                item.text.toLowerCase().includes(searchInput.toLowerCase())) ||
              (item.sender &&
                item.sender
                  .toLowerCase()
                  .includes(searchInput.toLowerCase())) ||
              (item.subject &&
                item.subject.toLowerCase().includes(searchInput.toLowerCase()))
          )
          .map((item, index) => {
            const postsPerPage = 50;
            const currentPage = mailOnScreen.numerPage;
            const startIndex = currentPage * postsPerPage;
            const endIndex = startIndex + postsPerPage;

            // Only proceed if the post's index is within the range of the current page
            if (index >= startIndex && index < endIndex) {
              console.log(item.text);
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
  );
}

export default User;
