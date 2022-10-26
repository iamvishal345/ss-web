import classNames from "classnames";
import styles from "./styles.module.scss";

const Divider = ({ children, className }) => {
  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.border} />
      {children && <span className={styles.content}>{children}</span>}
      <div className={styles.border} />
    </div>
  );
};

export default Divider;
