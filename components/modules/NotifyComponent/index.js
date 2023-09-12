import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const NotifyComponent = () => {
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    if (notification.type === "error") {
      toast.error(notification.message);
    } else if (notification.type === "success") {
      toast.success(notification.message);
    } else if (notification.type === "info") {
      toast.info(notification.message);
    }
  }, [notification]);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default NotifyComponent;
