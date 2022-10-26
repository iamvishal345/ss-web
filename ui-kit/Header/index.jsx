import React from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";
import Button from "../Button";

const Header = ({ header, body, leftButton, rightButton }) => {
  return (
    <div className={classNames(styles.container)}>
      <div className={classNames(styles.header)}>
        {leftButton ? (
          leftButton.component || (
            <Button
              className="text-clr-light justify-self-start"
              variant="link"
              label={leftButton.label}
              size="small"
              onClick={leftButton.onClick}
            />
          )
        ) : (
          <div>&shy;</div>
        )}
        <h1 className="m-0 font-size-lg">{header}</h1>
        {rightButton ? (
          rightButton.component || (
            <Button
              className="text-clr-light justify-self-end"
              variant="link"
              label={rightButton.label}
              size="small"
              onClick={rightButton.onClick}
            />
          )
        ) : (
          <div>&shy;</div>
        )}
      </div>
      {body && <div className="d-flex flex-column">{body}</div>}
    </div>
  );
};

export default Header;
