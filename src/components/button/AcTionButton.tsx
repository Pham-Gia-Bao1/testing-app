import React from "react";

interface ActionButtonProps {
  type: "primary" | "secondary" | "danger" | "success" | "warning" | "nomal";
  content: React.ReactNode;
  [key: string]: any; // For any additional props
}

export default function ActionButton({
  type = "primary",
  content,
  ...props
}: ActionButtonProps) {
  // Define type-based styles
  const baseClasses = "p-3 rounded";
  const typeClasses = {
    primary: "bg-blue-500 hover:bg-blue-700",
    secondary: "bg-gray-500 hover:bg-gray-700",
    danger: "bg-red-500 hover:bg-red-700",
    success: "bg-green-500 hover:bg-green-700",
    warning: "bg-yellow-500 hover:bg-yellow-700",
    nomal : "bg-gray-100 hover:bg-gray-200 text-black",
  };

  // Construct the final className
  const className = `${baseClasses} ${typeClasses[type]}`;

  return (
    <button className={className} {...props}>
      {content}
    </button>
  );
}
