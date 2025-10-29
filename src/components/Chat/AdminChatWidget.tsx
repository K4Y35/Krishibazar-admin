"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  FaCommentDots,
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";

interface Message {
  id: number;
  message: string;
  senderType?: string;
  sender_type?: string;
  senderName?: string;
  sender_name?: string;
  senderId?: number;
  sender_id?: number;
  createdAt?: string;
  created_at?: string;
  isRead?: boolean;
  is_read?: boolean;
}

interface ConnectedUser {
  id: number;
  name: string;
  unreadCount: number;
}

export default function AdminChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const admin = localStorage.getItem("admin_user");

    console.log("Admin chat widget loading...", { 
      token: token ? "Found" : "Missing", 
      admin: admin ? "Found" : "Missing",
      fullToken: token 
    });

    if (!token) {
      console.log("No admin_token found in localStorage");
      return;
    }

    if (!admin) {
      console.log("No admin_user found in localStorage");
      return;
    }

    let parsedAdmin;
    try {
      parsedAdmin = JSON.parse(admin);
      console.log("Parsed admin:", parsedAdmin);
    } catch (e) {
      console.error("Error parsing admin:", e);
      return;
    }

    if (!parsedAdmin.id && !parsedAdmin.userId) {
      console.log("No admin ID found in parsed data:", parsedAdmin);
      return;
    }

    const adminId = parsedAdmin.id || parsedAdmin.userId;
    console.log("Connecting admin to chat server. Admin ID:", adminId);

    // Connect to socket server
    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      console.log("Admin connected to chat server, socket ID:", newSocket.id);
      // Send auth after connection
      const adminId = parsedAdmin.id || parsedAdmin.userId;
      newSocket.emit("auth", {
        userId: adminId,
        userType: "admin",
        name: parsedAdmin.name || parsedAdmin.username || "Admin",
      });
      console.log("Auth emitted for admin:", adminId);
    });

    newSocket.on("message", (data: Message) => {
      console.log("Admin received message:", data);
      
      const senderId = data.senderId || data.sender_id;
      
      // If user is selected, add to messages
      if (selectedUser && senderId === selectedUser) {
        setMessages((prev) => [...prev, data]);
      } else {
        // Add to unread count
        setConnectedUsers((prev) =>
          prev.map((user) =>
            user.id === senderId
              ? { ...user, unreadCount: user.unreadCount + 1 }
              : user
          )
        );
      }
      
      setIsTyping(false);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    newSocket.on("user-connected", (userId: number) => {
      console.log("User connected:", userId);
      // Refresh user list
      fetchUsers();
    });

    newSocket.on("typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("disconnect", () => {
      console.log("Admin disconnected from chat server");
    });

    // Fetch connected users and their messages
    fetchUsers();

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (isOpen && messages.length > 0 && selectedUser) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      console.log("Selected user changed to:", selectedUser);
      fetchMessages();
      markMessagesAsRead();
    }
  }, [selectedUser]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Refresh users periodically when widget is open
    if (isOpen) {
      const interval = setInterval(() => {
        fetchUsers();
      }, 5000); // Every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      // Direct API call to backend - use ADMIN route
      const token = localStorage.getItem('admin_token') || localStorage.getItem('gcpayadmintoken');
      console.log("Fetching users with token:", token ? "Token found" : "No token");
      
      const response = await fetch("http://localhost:4000/admin/chat/messages", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log("Fetch users response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched users data from admin chat endpoint:", data);
        
        // Group messages by user
        const usersMap = new Map();
        if (data.success && data.data) {
          console.log("Processing messages to create user list...");
          data.data.forEach((msg: any) => {
            if (msg.sender_type === "user") {
              const userId = msg.sender_id;
              const userName = msg.sender_name || `User ${userId}`;
              
              if (!usersMap.has(userId)) {
                usersMap.set(userId, {
                  id: userId,
                  name: userName,
                  unreadCount: msg.is_read === false || msg.is_read === 0 ? 1 : 0,
                });
              } else {
                const user = usersMap.get(userId);
                if (msg.is_read === false || msg.is_read === 0) {
                  user.unreadCount += 1;
                }
              }
            }
          });
        }
        
        const users = Array.from(usersMap.values());
        console.log("Extracted users:", users);
        setConnectedUsers(users);
      } else {
        console.error("Failed to fetch users:", response.status);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      console.log("Fetching messages for user:", selectedUser);
      
      // Get messages for specific user
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:4000/admin/chat/messages/user/${selectedUser}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched messages response:", data);
        
        if (data.success && data.data) {
          setMessages(data.data);
          console.log("Messages set:", data.data);
        }
      } else {
        console.error("Failed to fetch messages, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`http://localhost:4000/admin/chat/messages/user/${selectedUser}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Reset unread count for this user
      setConnectedUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser
            ? { ...user, unreadCount: 0 }
            : user
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedUser) return;

    const admin = JSON.parse(localStorage.getItem("admin_user") || "{}");
    const adminId = admin.id || admin.userId;

    const messageData = {
      senderId: adminId,
      senderType: "admin",
      receiverId: selectedUser,
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
      senderName: admin.name || admin.username || "Admin",
    };

    socket.emit("send-message", messageData);
    setNewMessage("");

    // Add message optimistically
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: messageData.message,
        senderType: "admin",
        senderName: "You",
        senderId: messageData.senderId,
        createdAt: messageData.createdAt,
        isRead: false,
      },
    ]);

    // Reset unread count when admin sends a reply
    setConnectedUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser
          ? { ...user, unreadCount: 0 }
          : user
      )
    );

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const totalUnread = connectedUsers.reduce((sum, user) => sum + user.unreadCount, 0);

  const selectedUserName = connectedUsers.find((u) => u.id === selectedUser)?.name || "User";

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="User Messages"
      >
        <div className="relative">
          <FaCommentDots className="text-2xl" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              {totalUnread}
            </span>
          )}
        </div>
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden dark:bg-boxdark border border-stroke dark:border-strokedark">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-dark rounded-full p-2">
                <FaCommentDots />
              </div>
              <div>
                <h3 className="font-semibold">
                  {selectedUser ? selectedUserName : "User Messages"}
                </h3>
                <p className="text-xs text-white/80">
                  {connectedUsers.length} user{connectedUsers.length !== 1 ? "s" : ""} online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-dark rounded p-1 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* User List / Messages */}
          {!selectedUser ? (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-boxdark">
              {connectedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <FaCommentDots className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No users available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connectedUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-stroke dark:border-strokedark rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                          <FaUser />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-black dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Click to chat</p>
                        </div>
                      </div>
                      {user.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {user.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-boxdark">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-stroke dark:border-strokedark">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    ← Back to users
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUserName}
                  </span>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <FaCommentDots className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isAdmin = msg.senderType === "admin" || msg.sender_type === "admin";
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-2`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              isAdmin
                                ? "bg-primary text-white rounded-br-sm"
                                : "bg-white dark:bg-gray-700 text-black dark:text-white rounded-bl-sm shadow-sm"
                            }`}
                          >
                            {!isAdmin && (
                              <p className="text-xs font-semibold mb-1 text-primary">
                                {msg.senderName || msg.sender_name || "User"}
                              </p>
                            )}
                            <p className={`text-sm whitespace-pre-wrap ${isAdmin ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                              {msg.message}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isAdmin ? "text-white/60" : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 
                               msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-4 py-2 border border-stroke dark:border-strokedark">
                          <p className="text-sm text-gray-500 italic">User is typing...</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="border-t border-stroke dark:border-strokedark p-4 bg-white dark:bg-boxdark">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-stroke dark:border-strokedark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-boxdark text-black dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

