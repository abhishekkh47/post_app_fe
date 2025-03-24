import { useEffect, useRef, useState } from "react";
import { Group, Message, User, ImagePreviewData, fileMetadata } from "../types";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { CHAT_TYPE, WS_EVENTS, fileToBase64, base64ToFile } from "../utils";
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
  onClose: () => void;
}

const useChatPopup = ({
  selectedUser,
  selectedGroup,
  messages,
  updateMessages,
  onSendMessage,
  onClose,
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
    if (selectedImage.length > 0) {
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

      // Clear localStorage when sending the message
      localStorage.removeItem(
        `imagePreviews_${selectedUser?._id || selectedGroup?._id}`
      );
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files && files.length > 0) {
      const newSelectedImages: File[] = [];
      const newImagePreviews: string[] = [];
      const fileMetadata: fileMetadata[] = [];

      // Convert all files to base64 and store metadata
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const base64String = await fileToBase64(file);
          newSelectedImages.push(file);
          newImagePreviews.push(base64String);

          // Store file metadata for later reconstruction
          fileMetadata.push({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
          });
        } catch (error) {
          console.error("Error converting file to base64:", error);
        }
      }

      setSelectedImage((prevSelectedImages) => [
        ...prevSelectedImages,
        ...newSelectedImages,
      ]);

      setImagePreview((prevImagePreviews) => [
        ...prevImagePreviews,
        ...newImagePreviews,
      ]);

      // Store both base64 strings and file metadata in localStorage
      const currentPreviews = [...imagePreview, ...newImagePreviews];
      const currentMetadata = [
        ...selectedImage.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        })),
        ...fileMetadata,
      ];

      localStorage.setItem(
        `imagePreviews_${selectedUser?._id || selectedGroup?._id}`,
        JSON.stringify({
          id: selectedUser?._id || selectedGroup?._id,
          imagePreviews: currentPreviews,
          fileMetadata: currentMetadata,
          isBase64: true,
        })
      );
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
    setImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
    setSelectedImage((prevFiles) => prevFiles.filter((_, i) => i !== index));

    // Update localStorage after removing an image
    try {
      const storedData = localStorage.getItem(
        `imagePreviews_${selectedUser?._id || selectedGroup?._id}`
      );

      if (storedData) {
        const data: ImagePreviewData = JSON.parse(storedData);

        // Remove the image and its metadata at the specified index
        const updatedPreviews = data.imagePreviews.filter(
          (_, i) => i !== index
        );
        const updatedMetadata = data.fileMetadata.filter((_, i) => i !== index);

        if (updatedPreviews.length > 0) {
          localStorage.setItem(
            `imagePreviews_${selectedUser?._id || selectedGroup?._id}`,
            JSON.stringify({
              ...data,
              imagePreviews: updatedPreviews,
              fileMetadata: updatedMetadata,
            })
          );
        } else {
          // Remove from localStorage if no images left
          localStorage.removeItem(
            `imagePreviews_${selectedUser?._id || selectedGroup?._id}`
          );
        }
      }
    } catch (error) {
      console.error(
        "Error updating localStorage after discarding image:",
        error
      );
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getLocalImagePreviews = () => {
    try {
      const storedData = localStorage.getItem(
        `imagePreviews_${selectedUser?._id || selectedGroup?._id}`
      );
      if (!storedData) {
        setImagePreview([]);
        setSelectedImage([]);
        return;
      }

      const localImageData: ImagePreviewData = JSON.parse(storedData);
      if (
        localImageData &&
        localImageData.id === (selectedUser?._id || selectedGroup?._id)
      ) {
        // Check if the stored previews are base64 strings
        if (localImageData.isBase64) {
          setImagePreview(localImageData.imagePreviews);

          // Regenerate File objects from base64 strings
          if (
            localImageData.fileMetadata &&
            localImageData.fileMetadata.length ===
              localImageData.imagePreviews.length
          ) {
            try {
              const regeneratedFiles = localImageData.imagePreviews.map(
                (base64String, index) => {
                  const metadata = localImageData.fileMetadata[index];
                  return base64ToFile(base64String, metadata);
                }
              );

              setSelectedImage(regeneratedFiles);
            } catch (error) {
              console.error("Error recreating files from base64:", error);
              setSelectedImage([]);
            }
          } else {
            console.warn(
              "Metadata and preview counts don't match, can't regenerate files"
            );
            setSelectedImage([]);
          }
        } else {
          // Handle old format (URL.createObjectURL) by clearing it
          setImagePreview([]);
          setSelectedImage([]);
          localStorage.removeItem(
            `imagePreviews_${selectedUser?._id || selectedGroup?._id}`
          );
        }
      } else {
        setImagePreview([]);
        setSelectedImage([]);
      }
    } catch (error) {
      console.error("Error parsing image previews from localStorage:", error);
      setImagePreview([]);
      setSelectedImage([]);
    }
  };

  useEffect(() => {
    getLocalImagePreviews();
  }, [selectedUser, selectedGroup]);

  const onCloseChatPopup = () => {
    onClose();
    setImagePreview([]);
    setSelectedImage([]);
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
    onCloseChatPopup,
  };
};

export default useChatPopup;
