import React from "react";

type NotifyProps = {
  type: "success" | "error";
  message: string;
};

const Notify: React.FC<NotifyProps> = ({ type, message }) => {
  const bgColor = type === "success" ? "bg-green-600" : "bg-yellow-600";
  const textColor = type === "success" ? "text-green-100" : "text-yellow-100";

  return (
    <div className={`p-4 my-3 rounded ${bgColor} ${textColor}`}>{message}</div>
  );
};

export default Notify;
