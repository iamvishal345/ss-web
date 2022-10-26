import classNames from "classnames";
import styles from "./styles.module.scss";
const Loader = ({ type = "spinner", size, fullPage }) => (
  <>
    {
      {
        spinner: (
          <i
            className={classNames(
              { [styles.fullPage]: fullPage },
              "gg-spinner m-auto"
            )}
          ></i>
        ),
      }[type]
    }
  </>
);

export default Loader;
