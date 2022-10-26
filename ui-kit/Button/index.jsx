import classNames from "classnames";
import { Loader } from "..";
import styles from "./styles.module.scss";

const Button = ({
  children,
  label,
  className,
  loading,
  variant = "primary",
  size = "",
  ...otherProps
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      {...otherProps}
    >
      <div className={styles.label}>
        {loading ? <Loader type="spinner" /> : children || label}
      </div>
    </button>
  );
};

export default Button;
