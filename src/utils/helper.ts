export const getTextWithEmojis = (html: any) => {
  // Create a temporary DOM element
  const temp = document.createElement("div");

  temp.innerHTML = html;

  // Get the text content (preserves emojis)
  return temp.textContent || temp.innerText || "";
};
