import React, { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { chats as initialChats } from "../../data/chat.js";

const ChatInbox = () => {
  const [chats, setChats] = useState(initialChats);
  const [selectedChat, setSelectedChat] = useState(initialChats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // FIX 1: handleSendMessage is now INSIDE the component (stray closing brace removed above)
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageToSend = {
      id: Date.now(),
      sender: "me",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const messageToReceive = {
      id: Date.now() + 1,
      sender: "them",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, messageToSend, messageToReceive],
              lastMessage: newMessage.trim(),
            }
          : chat,
      ),
    );

    // FIX 3: both messageToSend AND messageToReceive are now added to selectedChat
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, messageToSend, messageToReceive],
      lastMessage: newMessage.trim(),
    }));

    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <div className="w-130 border-r border-gray-200 bg-white flex flex-col">
        <SidebarHeader />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ChatList
          filteredChats={filteredChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          searchTerm={searchTerm}
        />
      </div>

      {selectedChat && (
        <div className="flex-1 flex flex-col">
          <ChatHeader selectedChat={selectedChat} />
          <MessageList messages={selectedChat.messages} />
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInbox;
