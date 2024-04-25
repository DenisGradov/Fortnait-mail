import React from "react";
import styles from "./User.module.scss";
function User() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h2 className={`${styles.left__send} ${styles.noSelect}`}>Send mail</h2>
      </div>
      <div className={styles.right}></div>
    </div>
  );
}

export default User;
