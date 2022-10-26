import classNames from "classnames";
import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
const BottomPanel = ({ children, isActive, fullPage, onClose, className }) => {
  return (
    <div
      onClick={onClose}
      className={classNames({ [styles.active]: isActive }, styles.mask)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={classNames(
          { [styles.active]: isActive, [styles.fullPage]: fullPage },
          styles.container,
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default BottomPanel;
