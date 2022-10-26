import { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import classNames from "classnames";

export const InputPassword = ({
  inputNode,
  inputProps,
  label,
  error,
  suffix,
  wrapperStyleObject = {},
  inputNodeActive,
  showSuffix = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const suffixComponent = suffix || (
    <Button
      type="button"
      className={classNames("m-0 p-0")}
      variant="link"
      onClick={() => {
        setShowPassword(!showPassword);
      }}
    >
      {showPassword ? "Hide" : "Show"}
    </Button>
  );
  return (
    <Input
      inputNode={inputNode}
      inputProps={{ ...inputProps, type: showPassword ? "text" : "password" }}
      inputNodeActive={inputNodeActive}
      wrapperStyleObject={wrapperStyleObject}
      error={error}
      label={label || "Password"}
      suffix={showSuffix ? suffixComponent : null}
    />
  );
};
