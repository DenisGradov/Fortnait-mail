import styles from "./blocked.module.scss";
function Blocked({ userEmail }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperBlock}>
        <h1 className={styles.wrapperBlock__title}>You have been blocked</h1>
        <div className={styles.wrapperBlockMailbox}>
          <h2 className={styles.wrapperBlockMailbox__title}>Your mail:</h2>
          <h2 className={styles.wrapperBlockMailbox__mail}>{userEmail}</h2>
        </div>
        <h1 className={styles.wrapperBlock__text}>
          Your profile has been blocked for violating the terms of use of the
          service. To restore access, contact the service administration by
          sending a message to{" "}
          <span className={styles.wrapperBlock__textBlue}>
            admin@kvantomail.com
          </span>
        </h1>
      </div>
    </div>
  );
}

export default Blocked;
