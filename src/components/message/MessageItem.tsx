import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";

interface MessageItemProps {
  lastMessage: string;
  profileImage: string;
  name: string;
  message: string;
  isRead: boolean;
  isActive: boolean;
  onRead: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  lastMessage,
  profileImage,
  name,
  message,
  isRead,
  isActive,
  onRead,
}) => {
  const [initialIsRead, setIsRead] = useState(isRead);
  const [initialLastMessage, setInitialLastMessage] = useState(lastMessage);

  useEffect(() => {
    if (isRead && message) {
      setInitialLastMessage(message);
    }
  }, [isRead, message]);

  const handleRead = () => {
    setIsRead(true);
    onRead();
  };

  return (
    <div
      onClick={handleRead}
      className={`flex items-center p-4 ${isActive ? "bg-green-500" : "bg-white"} border-b border-gray-200 hover:bg-gray-300 ${
        isRead ? "" : "font-bold"
      }`}
    >
      <Avatar
        className="mr-4"
        alt="User Avatar"
        src={profileImage}
        sx={{ width: 24, height: 24 }}
      />
      <div className="ml-4 flex-1">
        <div className="flex flex-col justify-between">
          <h4 className="text-lg font-semibold text-black">{name}</h4>
          <p className={`text-gray-700 ${isRead ? "text-gray-400" : ""}`}>{initialLastMessage}</p>
        </div>
      </div>
      <div>
        <p className={`text-sm text-gray-500 bg-green-500 w-3 h-3 rounded-full ${isRead ? "hidden" : ""}`}></p>
      </div>
    </div>
  );
};

export default MessageItem;
