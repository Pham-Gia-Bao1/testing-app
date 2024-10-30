"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { getAllUsers } from "@/api"; // Thêm import cho addMessage
import Link from "next/link";
import MessageItem from "./MessageItem";
import { UserProfile, Message } from "@/types";
import SkeletonMessageItem from "../skeleton/SkeletonMessageItem";
import debounce from "lodash.debounce";
import Pusher from "pusher-js";
import { addMessageAction } from "@/redux/messagesSlice";

const ListUsers: React.FC = () => {
  const [listUsers, setListUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const messages = useSelector((state: RootState) => state.messages.messages);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch(); // Khai báo dispatch
  const [readMessages, setReadMessages] = useState<{ [key: number]: boolean }>({});
  const fetchingMoreData = useRef<boolean>(false);
  const [isMaxPage, setIsMaxPage] = useState<boolean>(false);
  const [loadingGetMoreData, setLoadingGetMoreData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const parentBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getUsers();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const pusher = new Pusher("012362f40cb7a6656b0f", {
      cluster: "ap1",
    });
    const channel = pusher.subscribe("chat");

    channel.bind("MessageSent", (data: { message: Message }) => {
      const receivedMessage = data.message;
      setNewMessage(receivedMessage);
      // Cập nhật tin nhắn mới vào Redux state
      dispatch(addMessageAction(receivedMessage));
      // Đánh dấu tin nhắn mới nhất là chưa đọc
      if (currentUser && receivedMessage.sender_id !== currentUser.id) {
        setReadMessages((prev) => ({
          ...prev,
          [receivedMessage.sender_id]: false,
        }));
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [dispatch, currentUser]);

  useEffect(() => {
    const handleResize = () => {
      if (parentBoxRef.current) {
        handleScroll();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [parentBoxRef.current]);

  const handleScroll = useCallback(
    debounce(() => {
      if (!parentBoxRef.current) return;

      const parentBox = parentBoxRef.current;
      const parentBoxRect = parentBox.getBoundingClientRect();
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollPosition =
        window.scrollY ||
        window.pageYOffset ||
        document.body.scrollTop +
          (document.documentElement && document.documentElement.scrollTop) ||
        0;
      const scrollDifference = documentHeight - viewportHeight - scrollPosition;

      if (
        scrollDifference < parentBoxRect.height * 2 &&
        !fetchingMoreData.current &&
        !loadingGetMoreData &&
        !isMaxPage
      ) {
        fetchingMoreData.current = true;
        getMoreData();
      }
    }, 200),
    [loadingGetMoreData, isMaxPage]
  );

  const getMoreData = async () => {
    setLoadingGetMoreData(true);
    try {
      const nextPage = page + 1;
      const users = await getAllUsers(nextPage);

      if (users && currentUser) {
        const filteredUsers = users.data.filter(
          (user: UserProfile) => user.id !== currentUser.id
        );
        if (filteredUsers.length === 0) {
          setIsMaxPage(true);
        } else {
          setListUsers((prevUsers) => [...prevUsers, ...filteredUsers]);
          setPage(nextPage);
        }
      }
    } catch (error) {
      console.error("Failed to fetch more data:", error);
    } finally {
      setLoadingGetMoreData(false);
      fetchingMoreData.current = false;
    }
  };

  const getUsers = async () => {
    try {
      const users = await getAllUsers(page);
      if (users && currentUser) {
        const filteredUsers = users.data.filter(
          (user: UserProfile) => user.id !== currentUser.id
        );
        setListUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLastMessageContentForCurrentUser = (userId: number): string => {
    const filteredMessages = messages.filter(
      (message: Message) =>
        (message.sender_id === currentUser?.id &&
          message.recipient_id === userId) ||
        (message.sender_id === userId &&
          message.recipient_id === currentUser?.id)
    );
    console.log(filteredMessages);
    if (filteredMessages.length > 0) {
      return filteredMessages[filteredMessages.length - 1].content;
    } else {
      return "";
    }
  };

  const getLastMessageOfCurrentUserWithAllRecipients = (user: UserProfile) => {
    console.log(user.sent_messages);
    const allMessages = [
      ...(user.received_messages || []),
      ...(user.sent_messages || []),

    ];

    console.log(allMessages);

    allMessages.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return allMessages.length > 0
      ? allMessages[0].content
      : "";
  };

  const handleRead = (userId: number) => {
    setReadMessages((prev) => ({ ...prev, [userId]: true }));
    setActiveUserId(userId);
  };

  const getMessagesAllUser = () => {
    return listUsers.map((user) => {
      const lastMessage = getLastMessageOfCurrentUserWithAllRecipients(user);
      return { user, lastMessage };
    });
  };

  const userMessages = getMessagesAllUser();

  return (
    <div
      ref={parentBoxRef}
      className="mt-8 pb-52 mb-20 bottom-96 h-screen sm:w-1/4 w-full bg-white shadow-md fixed top-12 overflow-y-auto scrollbar-container"
    >
      <div className="divide-y divide-gray-200">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <SkeletonMessageItem key={index} />
            ))
          : userMessages.map(({ user, lastMessage }) => (
              <Link href={`/messages/${user.id}`} key={user.id}>
                {token && currentUser !== null && (
                  <MessageItem
                    lastMessage={newMessage ? newMessage.content : lastMessage}
                    name={user.name}
                    profileImage={user.profile_picture}
                    message={getLastMessageContentForCurrentUser(user.id)}
                    isRead={!!readMessages[user.id]}
                    isActive={activeUserId === user.id}
                    onRead={() => handleRead(user.id)}
                  />
                )}
              </Link>
            ))}
      </div>
      {loadingGetMoreData &&
        Array.from({ length: 5 }).map((_, index) => (
          <SkeletonMessageItem key={index} />
        ))}
    </div>
  );
};

export default ListUsers;
