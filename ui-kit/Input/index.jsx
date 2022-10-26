import classNames from "classnames";
import styles from "./styles.module.scss";

const Input = ({
  inputNode,
  inputProps,
  label,
  error,
  suffix,
  wrapperStyleObject = {},
  inputNodeActive,
}) => {
  return (
    <div
      className={classNames(styles.container, {
        "mt-3": true,
      })}
    >
      <div
        className={classNames(styles.wrapper, { [styles.invalid]: error })}
        style={wrapperStyleObject}
      >
        {inputNode || <input className={styles.input} {...inputProps} />}
        <div
          className={classNames(styles.label, {
            [styles.active]:
              inputNodeActive || (inputProps && inputProps.value),
          })}
        >
          {label}
        </div>
        {suffix && <div className={styles.suffix}>{suffix}</div>}
      </div>
      {error?.message && <div className={styles.error}>{error.message}</div>}
    </div>
  );
};

export default Input;
