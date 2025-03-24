import { useEffect, useRef, useState } from "react";
import { Group, Message, User } from "../types";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { CHAT_TYPE, WS_EVENTS } from "../utils";
import { CommonService } from "../services";

interface UseChatProps {
  selectedUser: User | null;
  selectedGroup: Group | null;
  messages: Message[];
  updateMessages: (newMessage: Message) => void;
  onSendMessage: (
    content: string,
    attachments?: string[],
    type?: string
  ) => void;
}

const useChatPopup = ({
  selectedUser,
  selectedGroup,
  messages,
  updateMessages,
  onSendMessage,
}: UseChatProps) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const { socket, notifyTyping, notifyGroupTyping } = useSocket();
  const navigate = useNavigate();
  const chatId = selectedUser ? selectedUser._id : selectedGroup?._id;

  const {
    CHAT: {
      LISTENER: { NEW_MESSAGE, USER_TYPING },
    },
    GROUP: {
      LISTENER: { GROUP_NEW_MESSAGE, GROUP_USER_TYPING },
    },
  } = WS_EVENTS;

  // Listen for incoming messages from the WebSocket server
  useEffect(() => {
    if (socket) {
      socket.on(NEW_MESSAGE, (newMessage: Message) => {
        if (selectedUser && newMessage.senderId._id === selectedUser._id) {
          updateMessages(newMessage);
        }
      });

      socket.on(GROUP_NEW_MESSAGE, (newMessage: Message) => {
        if (selectedGroup && newMessage.senderId._id === selectedGroup._id) {
          updateMessages(newMessage);
        }
      });

      // Cleanup when the component unmounts or the socket changes
      return () => {
        socket.off(NEW_MESSAGE);
        socket.off(GROUP_NEW_MESSAGE);
      };
    }
  }, [selectedUser, selectedGroup, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (socket) {
      socket.on(USER_TYPING, (data: { userId: string }) => {
        if (selectedUser?._id == data.userId) {
          updateTypingStatus(true);

          setTimeout(() => {
            updateTypingStatus(false);
          }, 1500);
        }
      });

      socket.on(GROUP_USER_TYPING, (data: { groupId: string }) => {
        if (selectedGroup?._id == data.groupId) {
          updateTypingStatus(true);

          setTimeout(() => {
            updateTypingStatus(false);
          }, 1500);
        }
      });

      // Cleanup when the component unmounts or the socket changes
      return () => {
        socket.off(USER_TYPING);
        socket.off(GROUP_USER_TYPING);
      };
    }
  }, [selectedUser, selectedGroup, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (
    e: React.FormEvent,
    type: string = CHAT_TYPE.INDIVIDUAL
  ) => {
    e.preventDefault();
    let attachmentNames: string[] = [];
    if (selectedImage) {
      const response = await CommonService.uploadFiles(
        chatId as string,
        selectedImage
      );
      attachmentNames = response.filename;
    }
    if (attachmentNames.length > 10) {
      alert("You can only send 10 images at a time");
      return false;
    }
    if (newMessage.trim() || attachmentNames.length) {
      onSendMessage(newMessage, attachmentNames, type);
      setNewMessage("");
      setSelectedImage([]);
      setImagePreview([]);
    }
  };

  const handleTyping = () => {
    if (selectedUser && socket && newMessage.length) {
      notifyTyping(selectedUser._id);
    }
    if (selectedGroup && socket && newMessage.length) {
      notifyGroupTyping(selectedGroup._id);
    }
  };

  const onProfileClick = () => {
    navigate(`/profile/${selectedUser?._id}`);
  };
  const onGroupClick = () => {
    navigate(`/group/${selectedGroup?._id}`);
  };

  const toggleMinimize = () => {
    setIsMinimized((prevState) => !prevState);
  };

  const updateNewMessage = (newMessage: string) => {
    setNewMessage(newMessage);
  };

  const updateTypingStatus = (status: boolean) => {
    setIsTyping(status);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files) {
      const newSelectedImages: File[] = [];
      const newImagePreviews: string[] = [];
      for (let file of files) {
        // setIsFileUpdated(true);
        newSelectedImages.push(file);
        newImagePreviews.push(URL.createObjectURL(file));
      }
      setSelectedImage((prevSelectedImages) => [
        ...prevSelectedImages,
        ...newSelectedImages,
      ]);
      setImagePreview((prevImagePreviews) => [
        ...prevImagePreviews,
        ...newImagePreviews,
      ]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input when the "Upload Image" button is clicked
  const handleUploadClick = () => {
    fileInputRef.current?.click(); // Open the file input dialog
  };

  const discardSelectedImage = (index: number) => {
    // setImagePreview([]);
    // setSelectedImage([]);
    setImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
    setSelectedImage((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    newMessage,
    updateNewMessage,
    isMinimized,
    toggleMinimize,
    handleSend,
    handleTyping,
    onProfileClick,
    messagesEndRef,
    isTyping,
    onGroupClick,
    fileInputRef,
    imagePreview,
    handleFileChange,
    handleUploadClick,
    discardSelectedImage,
  };
};

export default useChatPopup;
