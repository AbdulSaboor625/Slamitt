import { Spin } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const Spinner = () => {
  const spinner = useSelector((state) => state.config.spinner);
  return spinner.length ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff8",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" />
    </div>
  ) : (
    <div />
  );
};

export default Spinner;
