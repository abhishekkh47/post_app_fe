import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";
import AutoLinks from "quill-auto-links";
import { Mention as QuillMention } from "quill-mention";

import { TEXT_EDITOR_ALLOWED_CHAR } from "../../utils";

interface TextEditorPropTypes {
  handleChangeText: (content: string) => void;
  error: string;
  textValue: string;
  handleMentionID: (mentionIds: any[]) => void;
  isReply?: boolean;
  commentDoneBy?: string;
  employeeList: any[];
  enableMentions?: boolean;
}

const TextEditor: React.FC<TextEditorPropTypes> = ({
  handleChangeText,
  error,
  textValue,
  handleMentionID,
  isReply = false,
  commentDoneBy,
  employeeList,
  enableMentions = false,
}) => {
  const [value, setValue] = useState(textValue || "");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const editorRef = useRef<ReactQuill | null>(null);
  const emojiButtonRef = useRef<HTMLElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  // Maintain atValues as a state to ensure reactivity
  const [atValues, setAtValues] = useState<any[]>([]);

  // useEffect(() => {
  //   setAtValues(employeeList);
  // }, [employeeList]);

  // useEffect(() => {
  //   setValue(textValue || "");
  // }, [textValue]);

  // useEffect(() => {
  //   setValue(isReply ? commentDoneBy || "" : textValue);

  //   // Safely set cursor position
  //   const timer = setTimeout(() => {
  //     const quill = editorRef.current?.getEditor();
  //     if (quill) {
  //       quill.setSelection(quill.getLength(), 0);
  //     }
  //   }, 200);

  //   // Find emoji button and store ref
  //   const emojiButton = document.querySelector(".ql-emoji") as HTMLElement;
  //   emojiButtonRef.current = emojiButton;

  //   return () => clearTimeout(timer);
  // }, []);

  // Safely register modules
  useEffect(() => {
    if (enableMentions) {
      Quill.register("modules/mention", QuillMention);
    }
    Quill.register("modules/autoLinks", AutoLinks);
  }, [enableMentions]);

  const mention = {
    allowedChars: TEXT_EDITOR_ALLOWED_CHAR,
    mentionDenotationChars: ["@"],
    source: function (
      searchTerm: string,
      renderList: (matches: any[], term: string) => void,
      mentionChar: string
    ) {
      const values = atValues || [];

      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = values.filter((value: any) =>
          value?.value?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        renderList(matches, searchTerm);
      }
    },
  };

  const toolBarOptions = [
    [{ size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["emoji"],
  ];

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "header",
    "size",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "indent",
    "link",
    "mention",
    "image",
  ];

  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolBarOptions,
        handlers: {
          emoji: () => setShowEmojiPicker((prev) => !prev),
        },
      },
      mention: mention,
      autoLinks: true,
      clipboard: { matchVisual: false },
    }),
    [mention]
  );

  const handleChange = (
    content: string,
    delta: any,
    source: string,
    editor: any
  ) => {
    if (editor) {
      const contentDelta = editor.getContents();
      const mentionIds = extractMentionIds(contentDelta);

      // Modify links to add https:// if missing
      const modifiedContent = content.replace(
        /<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/g,
        (match, href, text) => {
          if (!href.startsWith("http://") && !href.startsWith("https://")) {
            return `<a href="https://${href}" target="_blank">${text}</a>`;
          }
          return match;
        }
      );

      handleChangeText(modifiedContent);
      if (handleMentionID) {
        handleMentionID(mentionIds);
      }
      setValue(modifiedContent);
    }
  };

  const extractMentionIds = (delta: any): any[] => {
    return (
      delta?.ops?.reduce((ids: any[], op: any) => {
        if (op?.insert?.mention) {
          ids.push(op.insert.mention.id);
        }
        return ids;
      }, []) || []
    );
  };

  const handleEmojiClick = (emojiData: any) => {
    const quill = editorRef.current?.getEditor();
    if (quill) {
      quill.focus();
      const selection = quill.getSelection();
      const cursorPosition = selection ? selection.index : quill.getLength();
      quill.insertEmbed(cursorPosition, "image", emojiData.imageUrl);
      quill.setSelection(cursorPosition + 1);
    }
  };

  // Custom hook for click outside
  const useClickOutside = (
    refs: React.RefObject<HTMLElement | null>[],
    handler: () => void
  ) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const isOutside = refs.every(
          (ref) => !ref.current || !ref.current.contains(event.target as Node)
        );

        if (isOutside) {
          handler();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      // document.addEventListener("touchstart", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        // document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [refs, handler]);
  };

  // useClickOutside([pickerRef, emojiButtonRef], () => {
  //   if (showEmojiPicker) setShowEmojiPicker(false);
  // });

  return (
    <div className="relative">
      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        // modules={modules}
        formats={formats}
      />

      {showEmojiPicker && (
        <div
          ref={pickerRef}
          className="absolute z-50 bg-white border shadow-lg p-2"
          style={{ top: "40px", right: "10px" }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {error && (
        <div className="text-error-500 text-sm font-normal mt-1.5">{error}</div>
      )}
    </div>
  );
};

export default TextEditor;

// TextEditor.propTypes = {
//   handleChangeText: PropTypes.func,
//   error: PropTypes.string,
//   textValue: PropTypes.string,
//   editorClassName: PropTypes.string,
//   handleMentionID: PropTypes.func,
//   isCommnetData: PropTypes.string,
//   onKeyDown: PropTypes.func,
//   isReply: PropTypes.bool,
//   commentDoneBy: PropTypes.string,
//   employeeList: PropTypes.array,
//   enableMentions: PropTypes.bool,
// };

// export default TextEditor;
