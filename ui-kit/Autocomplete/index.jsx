import { useState } from "react";
import styles from "./styles.module.scss";
import Input from "../Input";
import classNames from "classnames";

const Autocomplete = ({
  inputProps,
  error,
  label,
  options = [],
  inputRenderer,
  dropdownRenderer,
  showOnType,
  lazyLoading,
  optionsCallback,
}) => {
  const { value, onChange, onFocus, onBlur } = inputProps;
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onInputChange = async (e) => {
    setInputValue(e.target.value);
    if (!e.target.value && isOpen && showOnType) setIsOpen(false);
    if (showOnType && !isOpen) setIsOpen(true);
    if (lazyLoading) {
      if (e.target.value.length >= 3) {
        try {
          setIsLoading(true);
          const data = await optionsCallback(e.target.value);
          setFilteredOptions(data);
          setIsLoading(false);
        } catch (error) {
          setFilteredOptions([]);
          setIsLoading(false);
        }
      } else {
        setIsOpen(false);
      }
    } else {
      setFilteredOptions(
        options.filter(
          ({ value }) => value.indexOf(e.target.value.toLowerCase()) > -1
        )
      );
    }
  };
  const onInputFocus = (e) => {
    if (!showOnType) setIsOpen(true);
    if (typeof onFocus === "function") onFocus(e);
  };
  const onInputBlur = () => {
    setIsOpen(false);
    if (typeof onBlur === "function") onBlur(value);
  };

  const handleValueSelect = (optionValue, optionLabel) => {
    setInputValue(optionLabel);
    onChange(optionValue);
    setIsOpen(false);
  };
  return (
    <div className={styles.wrapper}>
      {typeof inputRenderer === "function" ? (
        inputRenderer({
          ...inputProps,
          onFocus: onInputFocus,
          onBlur: onInputBlur,
          onChange: onInputChange,
          value: inputValue,
          "aria-expanded": isOpen,
          role: "combobox",
          autoComplete: "off",
        })
      ) : (
        <Input
          inputProps={{
            ...inputProps,
            onFocus: onInputFocus,
            onBlur: onInputBlur,
            onChange: onInputChange,
            value: inputValue,
            "aria-expanded": isOpen,
            role: "combobox",
            autoComplete: "off",
          }}
          error={error}
          label={label}
        />
      )}
      {isOpen && (
        <div
          className={classNames(
            styles.optionsContainer,
            "animate__animated animate__fadeIn"
          )}
        >
          {typeof dropdownRenderer === "function" ? (
            dropdownRenderer(options, filteredOptions, value, handleValueSelect)
          ) : (
            <ul role="listbox" className={styles.options}>
              {lazyLoading && isLoading ? (
                <li> Loading...</li>
              ) : filteredOptions.length ? (
                filteredOptions.map(({ value: optionValue, label }) => (
                  <li
                    role="option"
                    aria-selected={value === optionValue}
                    className={classNames(styles.option, {
                      [styles.active]: value === optionValue,
                    })}
                    key={optionValue}
                    onMouseDown={() => handleValueSelect(optionValue, label)}
                  >
                    {label}
                  </li>
                ))
              ) : (
                <li>{"No Record Found"}</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
