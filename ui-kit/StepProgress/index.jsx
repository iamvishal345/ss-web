import classNames from "classnames";
import styles from "./styles.module.scss";

const StepProgress = ({ align, steps, staticSteps, activeStep }) => {
  return (
    <div style={{ flexDirection: align }} className={styles.wrapper}>
      {steps.map(({ icon, text }, i) => {
        return (
          <div key={i} style={{ flexDirection: align }} className={styles.step}>
            {staticSteps ? (
              <div
                style={{ flexDirection: align === "column" ? "row" : "column" }}
                className={classNames(styles.item, {
                  [styles.activeStep]: activeStep > i,
                })}
              >
                {icon && (
                  <div
                    style={{ flexDirection: align }}
                    className={styles.iconWrapper}
                  >
                    <div className={styles.icon}>{icon}</div>
                    {i !== steps.length - 1 && (
                      <div
                        style={{
                          width: align === "row" ? "3rem" : "auto",
                          height: align === "column" ? "3rem" : "auto",
                        }}
                        className={classNames(styles.bar, {
                          [styles.activeBar]: activeStep > i,
                        })}
                      />
                    )}
                  </div>
                )}
                {text && <div className={styles.text}>{text}</div>}
              </div>
            ) : (
              <>
                <button
                  className={classNames(styles.item, {
                    [styles.activeStep]: activeStep > i,
                  })}
                >
                  {icon && <div className={styles.btnIcon}>{icon}</div>}
                </button>
                {icon ? (
                  text && <div className={styles.text}>{text}</div>
                ) : (
                  <button className={styles.btnText}>{text}</button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
