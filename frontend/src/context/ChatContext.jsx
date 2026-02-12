import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext();
const toId = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.$oid) return String(value.$oid);
  if (typeof value === "object" && value._id) return String(value._id);
  if (typeof value?.toString === "function") return String(value.toString());
  return String(value);
};
const normalizeMessage = (message) => ({
  ...message,
  _id: toId(message?._id),
  senderId: toId(message?.senderId),
  receiverId: toId(message?.receiverId),
});
const mergeById = (prev, nextMessage) => {
  const nextId = toId(nextMessage?._id);
  if (!nextId) return [...prev, nextMessage];
  if (prev.some((m) => toId(m._id) === nextId)) return prev;
  return [...prev, nextMessage];
};
const messageTime = (message) => {
  const t = new Date(message?.createdAt || 0).getTime();
  return Number.isNaN(t) ? 0 : t;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);
  const [clearedChats, setClearedChats] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("chat_notifications_enabled") === "true";
  });
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "denied"
  );
  const selectedUserRef = useRef(null);
  const usersRef = useRef([]);
  const notificationsEnabledRef = useRef(false);
  const latestMessagesRequestRef = useRef(0);
  const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";
  const clearedKey = `chat_cleared_at_${toId(authUser?._id)}`;

  useEffect(() => {
    if (!authUser) {
      setClearedChats({});
      return;
    }

    const raw = localStorage.getItem(clearedKey);
    if (!raw) {
      setClearedChats({});
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setClearedChats(parsed && typeof parsed === "object" ? parsed : {});
    } catch {
      setClearedChats({});
    }
  }, [authUser, clearedKey]);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    notificationsEnabledRef.current = notificationsEnabled;
  }, [notificationsEnabled]);

  const parseResponseBody = useCallback(async (res) => {
    const text = await res.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return { error: text, message: text };
    }
  }, []);

  const readErrorMessage = (data, fallback) => {
    if (data && typeof data === "object") {
      return data.error || data.message || fallback;
    }
    return fallback;
  };

  const chatKeyFor = useCallback(
    (otherUserId) => `${toId(authUser?._id)}__${toId(otherUserId)}`,
    [authUser]
  );

  const filterClearedMessages = useCallback(
    (list, otherUserId) => {
      const cutoff = clearedChats[chatKeyFor(otherUserId)] || 0;
      if (!cutoff) return list;
      return list.filter((message) => messageTime(message) > cutoff);
    },
    [chatKeyFor, clearedChats]
  );

  const bringUserToTop = useCallback((userId) => {
    const normalizedUserId = toId(userId);
    if (!normalizedUserId) return;
    setUsers((prev) => {
      const index = prev.findIndex((u) => toId(u._id) === normalizedUserId);
      if (index <= 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.unshift(moved);
      return next;
    });
  }, []);

  const maybeNotify = useCallback((newMessage) => {
    if (
      !notificationsEnabledRef.current ||
      typeof window === "undefined" ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    const activeUser = selectedUserRef.current;
    const senderId = toId(newMessage.senderId);
    const activeUserId = toId(activeUser?._id);
    const isCurrentOpenChat = activeUser && activeUserId === senderId;
    if (isCurrentOpenChat) return;

    const sender = usersRef.current.find((u) => toId(u._id) === senderId);
    const senderName = sender?.fullName || "New message";
    const bodyText = newMessage.text || "Sent you an image";
    new Notification(senderName, { body: bodyText });
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!authUser) {
      setSocket(null);
      setOnlineUsers([]);
      setSelectedUser(null);
      setMessages([]);
      return;
    }

    const newSocket = io(socketUrl, {
      query: { userId: toId(authUser._id) },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers((userIds || []).map(toId));
    });

    newSocket.on("newMessage", (newMessage) => {
      const incoming = normalizeMessage(newMessage);
      const senderId = toId(incoming.senderId);
      const receiverId = toId(incoming.receiverId);
      const authUserId = toId(authUser._id);
      const chatPartnerId = senderId === authUserId ? receiverId : senderId;
      bringUserToTop(chatPartnerId);
      maybeNotify(incoming);

      const activeUser = selectedUserRef.current;
      if (!activeUser) return;
      const activeUserId = toId(activeUser._id);

      const belongsToActiveChat =
        senderId === activeUserId || receiverId === activeUserId;

      if (belongsToActiveChat) {
        const filteredIncoming = filterClearedMessages([incoming], activeUserId);
        if (filteredIncoming.length > 0) {
          setMessages((prev) => mergeById(prev, filteredIncoming[0]));
        }
      }
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [authUser, socketUrl, bringUserToTop, maybeNotify, filterClearedMessages]);

  // Fetch all users
  const getUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch("/api/message/users", {
        credentials: "include",
      });
      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(readErrorMessage(data, "Failed to load users"));
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [parseResponseBody]);

  // Fetch messages for selected user
  const getMessages = useCallback(async (userId, options = {}) => {
    const { silent = false } = options;
    const requestId = Date.now();
    latestMessagesRequestRef.current = requestId;
    if (!silent) {
      setIsLoadingMessages(true);
    }
    try {
      const res = await fetch(`/api/message/${userId}`, {
        credentials: "include",
      });
      const data = await parseResponseBody(res);
      if (!res.ok) throw new Error(readErrorMessage(data, "Failed to load messages"));
      const normalized = Array.isArray(data) ? data.map(normalizeMessage) : [];
      const filtered = filterClearedMessages(normalized, userId);

      // Ignore stale responses when user switches chats quickly.
      if (latestMessagesRequestRef.current === requestId) {
        setMessages(filtered);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      if (!silent && latestMessagesRequestRef.current === requestId) {
        setIsLoadingMessages(false);
      }
    }
  }, [parseResponseBody, filterClearedMessages]);

  // Send message
  const sendMessage = useCallback(async (messageData) => {
    if (!selectedUser) return;

    setIsSendingMessage(true);
    try {
      const res = await fetch(`/api/message/send/${selectedUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(messageData),
      });

      const data = normalizeMessage(await parseResponseBody(res));
      if (!res.ok) throw new Error(readErrorMessage(data, "Failed to send message"));

      bringUserToTop(selectedUser._id);
      const filtered = filterClearedMessages([data], selectedUser._id);
      if (filtered.length > 0) {
        setMessages((prev) => mergeById(prev, filtered[0]));
      }
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setIsSendingMessage(false);
    }
  }, [bringUserToTop, parseResponseBody, selectedUser, filterClearedMessages]);

  // Select user and load their messages
  const selectUser = useCallback(async (user) => {
    setSelectedUser(user);
    bringUserToTop(user._id);
    await getMessages(user._id);
  }, [bringUserToTop, getMessages]);

  useEffect(() => {
    if (!selectedUser) return undefined;
    const intervalId = setInterval(() => {
      getMessages(selectedUser._id, { silent: true });
    }, 2500);
    return () => clearInterval(intervalId);
  }, [getMessages, selectedUser]);

  const setNotificationPreference = useCallback(async (enabled) => {
    if (typeof window === "undefined") return false;
    if (!("Notification" in window)) {
      toast.error("Browser notifications are not supported");
      return false;
    }

    if (enabled) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission !== "granted") {
        toast.error("Notification permission denied");
        setNotificationsEnabled(false);
        localStorage.setItem("chat_notifications_enabled", "false");
        return false;
      }
      setNotificationsEnabled(true);
      localStorage.setItem("chat_notifications_enabled", "true");
      toast.success("Notifications enabled");
      return true;
    }

    setNotificationsEnabled(false);
    localStorage.setItem("chat_notifications_enabled", "false");
    toast.success("Notifications disabled");
    return true;
  }, []);

  const deleteCurrentConversation = useCallback(async () => {
    if (!selectedUser) return false;
    setIsDeletingConversation(true);
    try {
      const key = chatKeyFor(selectedUser._id);
      const next = { ...clearedChats, [key]: Date.now() };
      setClearedChats(next);
      localStorage.setItem(clearedKey, JSON.stringify(next));
      setMessages([]);
      toast.success("Chat deleted for you");
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setIsDeletingConversation(false);
    }
  }, [selectedUser, chatKeyFor, clearedChats, clearedKey]);

  const value = {
    socket,
    users,
    selectedUser,
    messages,
    onlineUsers,
    isLoadingUsers,
    isLoadingMessages,
    isSendingMessage,
    getUsers,
    getMessages,
    sendMessage,
    selectUser,
    setMessages,
    notificationsEnabled,
    notificationPermission,
    setNotificationPreference,
    deleteCurrentConversation,
    isDeletingConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
