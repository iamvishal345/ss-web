import classNames from "classnames";
import "animate.css";
import { useEffect } from "react";
import { useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.scss";

const Modal = ({
  header,
  body,
  footer,
  closeModal,
  parentRef,
  showCloseButton = true,
}) => {
  const closeRef = useRef(null);
  const animateRef = useRef(null);
  const containerRef = useRef(document.getElementById("__next"));

  useLayoutEffect(() => {
    if (closeRef.current) {
      closeRef.current.focus();
    }
    document.body.style.overflow = "hidden";
    return () => {
      parentRef && parentRef.focus();
      document.body.style.overflow = "visible";
    };
  }, [parentRef]);

  const animateCloseModal = () => {
    animateRef.current.classList.remove("animate__fadeInDown");
    animateRef.current.classList.add("animate__fadeOutDown");
    setTimeout(() => {
      closeModal();
    }, 500);
  };

  return ReactDOM.createPortal(
    <div className={styles.backDrop}>
      <div
        ref={animateRef}
        className={`animate__animated animate__fadeInDown animate__faster ${styles.modalWrapper}`}
      >
        <div className={styles.headerWrapper}>
          {header}
          {showCloseButton && (
            <i
              tabIndex={0}
              ref={closeRef}
              role="button"
              aria-label="Close Modal"
              onClick={animateCloseModal}
              onKeyUp={(e) => e.key === "Enter" && closeModal()}
              className={classNames("gg-close", styles.close)}
            ></i>
          )}
        </div>
        {body && <div className={styles.bodyWrapper}>{body}</div>}
        {footer && <div className={styles.footerWrapper}>{footer}</div>}
      </div>
    </div>,
    containerRef.current
  );
};

export default Modal;
