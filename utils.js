import { Store } from "react-notifications-component";

export const showNotification = (success, error) => {
  Store.addNotification({
    title: success ? "Success!" : "Error!",
    message: success
      ? success.message || "Saved data successfully!"
      : error.message,
    type: success ? "success" : "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: { showIcon: true, duration: 3000 },
  });
};
