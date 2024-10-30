"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { FaPhone, FaVideo } from "react-icons/fa";
import SendIcon from "@mui/icons-material/Send";
import Pusher from "pusher-js";
import { isString } from "lodash";
import SubLoading from "@/components/loading/subLoading";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { message } from "antd";
import { Avatar } from "@mui/material";

import {
  createNewMessage,
  deleteMessage,
  getConversation,
  getUserById,
  updateMessage,
} from "@/api";
import {
  deleteMessageAction,
  updateMessageAction,
  setMessagesAction,
  addMessageAction,
} from "@/redux/messagesSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Message, MessagesPageProps, UserProfile } from "@/types";
import SkeletonHeaderMessage from "../skeleton/SkeletonHeaderMessage";

const Chat: React.FC<MessagesPageProps> = ({ senderId, recipientId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showOptionsForMessageId, setShowOptionsForMessageId] = useState<
    number | null
  >(null);
  const [checkHasMessage, setCheckHasMessage] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [recipient, setRecipient] = useState<UserProfile>({
    id: 0,
    role_id: 0,
    name: "",
    email: "",
    password: "",
    address: "",
    created_at: "",
    date_of_birth: "",
    deleted_at: null,
    email_verified_at: "",
    gender: "",
    phone_number: "",
    profile_picture: "",
    remember_token: "",
    status: 0,
    updated_at: "",
  });
  const [editingMessage, setEditingMessage] = useState<{
    id: number;
    content: string;
  } | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pusher = new Pusher("012362f40cb7a6656b0f", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe("chat");

    channel.bind("MessageSent", (data: { message: Message }) => {
      const receivedMessage = data.message;
      console.log(receivedMessage);
      if (
        (receivedMessage.sender_id == senderId &&
          receivedMessage.recipient_id == recipientId) ||
        (receivedMessage.sender_id == recipientId &&
          receivedMessage.recipient_id == senderId)
      ) {
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        dispatch(addMessageAction(receivedMessage));
      } else {
        console.log(
          "Received message does not belong to this conversation:",
          receivedMessage
        );
      }
    });

    channel.bind("MessageUpdated", (data: { message: Message }) => {
      console.log(data.message);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === data.message.id ? data.message : msg
        )
      );
      dispatch(updateMessageAction(data.message));
    });

    channel.bind("MessageDeleted", (data: { messageId: number }) => {
      console.log(data.messageId);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id != data.messageId)
      );
      dispatch(deleteMessageAction(data.messageId));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [recipientId, senderId, dispatch]);

  useEffect(() => {
    fetchMessages(page);
    fetchRecipient();
  }, [recipientId, senderId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async (page: number) => {
    try {
      const response = await getConversation(senderId, recipientId, page);
      if (response.data.length === 0) {
        setCheckHasMessage(false);
      }
      const processedMessages = response.data
        .map((message: Message) => ({
          ...message,
          isUser: message.sender_id === senderId,
          isEditing: false,
        }))
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      setMessages(processedMessages);
      dispatch(setMessagesAction(processedMessages));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipient = async () => {
    try {
      const user = await getUserById(recipientId);
      setRecipient(user.data);
    } catch (error) {
      console.error("Error fetching recipient:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newMessage.trim() === "") return;
    const newMessageObj: Message = {
      id: messages.length + 1,
      sender_id: senderId,
      recipient_id: isString(recipientId) ? parseInt(recipientId) : recipientId,
      content: newMessage,
      read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isUser: true,
    };
    try {
      const savedMessage = await createNewMessage(newMessageObj);
      setMessages(
        [...messages, { ...savedMessage, isUser: true }].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      );
      setNewMessage("");
      dispatch(addMessageAction(savedMessage));
      fetchMessages(page);

    } catch (error) {
      console.error("Error creating message:", error);

    }
  };

  const handleToggleEdit = (messageId: number) => {
    setShowOptionsForMessageId(null);
    const updatedMessages = messages
      .map((message) =>
        message.id === messageId
          ? { ...message, isEditing: !message.isEditing }
          : message
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    setMessages(updatedMessages);
    if (editingMessage && editingMessage.id === messageId) {
      setEditingMessage(null);
    } else {
      const messageToEdit = messages.find(
        (message) => message.id === messageId
      );
      if (messageToEdit) {
        setEditingMessage({ id: messageId, content: messageToEdit.content });
      }
    }
  };

  const handleUpdateMessage = async (
    messageId: number,
    updatedContent: string
  ) => {
    try {
      await updateMessage(messageId, { content: updatedContent });
      const updatedMessages = messages
        .map((message) =>
          message.id === messageId
            ? {
                ...message,
                content: updatedContent,
                isEditing: false,
                isUser: true,
              }
            : message
        )
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      message.success("Update message successfully!");
      setMessages(updatedMessages);
      setEditingMessage(null);
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: number | string) => {
    try {
      await deleteMessage(messageId);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
      message.success("Delete message successfully!");
      dispatch(deleteMessageAction(messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="w-full h-full mx-auto rounded-lg shadow-md overflow-hidden relative bg-gray-200 pt-20 ">
      <div className="sm:w-9/12  p-4 border-b  border-gray-200 flex items-center justify-between fixed  top-20 bg-white z-10 w-full">
        {loading || !recipient.profile_picture ? (
          <SkeletonHeaderMessage />
        ) : (
          <div className="flex items-center">
            <Avatar
              className="mr-4"
              alt="User Avatar"
              src={recipient.profile_picture}
              sx={{ width: 24, height: 24 }}
            />
            <div>
              <h2 className="text-lg text-gray-900 font-semibold">
                {recipient.name}
              </h2>
              <p className="text-sm text-gray-600">Active 1 hour ago</p>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-3 text-gray-600">
          <FaPhone className="cursor-pointer hover:text-gray-900" />
          <FaVideo className="cursor-pointer hover:text-gray-900" />
        </div>
      </div>
      <div
        ref={chatContainerRef}
        className="p-4 w-full space-y-4 pb-24 h-full overflow-y-auto min-h-screen mt-3 "
      >
        {!checkHasMessage ? (
          <p className="text-center text-gray-600">You have no message yet!</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start ${
                message.isUser ? "justify-end" : "justify-start"
              } relative group`}
            >
              <div
                className={`relative max-w-xs p-3 rounded-lg ${
                  message.isUser
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-900"
                } ${message.isEditing ? "editMode" : ""}`}
              >
                {showOptionsForMessageId === message.id && (
                  <div
                    className={`absolute top-0 ${
                      message.isUser ? "-left-24" : "-right-24"
                    } mt-2 mr-2 bg-white border border-gray-300 rounded shadow-md`}
                  >
                    <button
                      className="text-sm w-full py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => handleToggleEdit(message.id)}
                    >
                      Update
                    </button>
                    <button
                      className="text-sm w-full py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
                {editingMessage && editingMessage.id === message.id ? (
                  <>
                    <textarea
                      className="w-full p-1 text-sm outline-none border rounded bg-blue-100"
                      value={editingMessage.content}
                      onChange={(e) =>
                        setEditingMessage({
                          ...editingMessage,
                          content: e.target.value,
                        })
                      }
                    />
                    <button
                      className="text-xs text-blue-500 hover:text-blue-700 float-end"
                      onClick={() =>
                        handleUpdateMessage(message.id, editingMessage.content)
                      }
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="message-content break-words w-full">
                        <h1> {message.content}</h1>
                      </div>
                      {message.isUser && (
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            setShowOptionsForMessageId(
                              showOptionsForMessageId === message.id
                                ? null
                                : message.id
                            )
                          }
                        >
                          <MoreVertIcon />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <form
        className="sm:w-9/12 p-4 border-t border-gray-200 flex fixed w-full bottom-0 bg-white "
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          className="flex-1 text-gray-950 border mr-2 border-gray-300 p-2 rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />

        <div className="text-blue-600 flex justify-center items-center">
          <EmojiEmotionsIcon />
        </div>
        <button
          type="submit"
          className="m-2 flex justify-center items-center text-blue-600 focus:outline-none"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default Chat;
