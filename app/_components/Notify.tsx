import React from "react";

type NotifyProps = {
  type: "success" | "error";
  message: string;
};

const Notify: React.FC<NotifyProps> = ({ type, message }) => {
  const bgColor = type === "success" ? "bg-green-600" : "bg-yellow-600";
  const textColor = type === "success" ? "text-green-100" : "text-yellow-100";
  const emoji = type === "success" ? "✅" : "⚠️";
  return (
    <div className={`p-2 rounded-lg truncate max-h-10 ${bgColor} ${textColor}`}>{emoji}{message}</div>
  );
};

export default Notify;
