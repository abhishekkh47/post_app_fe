// Convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToFile = (
  base64String: string,
  metadata: { name: string; type: string; lastModified: number }
): File => {
  // Extract the content type and base64 data
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || metadata.type;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Create a File object with the original metadata
  return new File([u8arr], metadata.name, {
    type: mime,
    lastModified: metadata.lastModified,
  });
};

export const debounce = (
  func: () => Promise<void>,
  delay: number
): React.MouseEventHandler<HTMLButtonElement> => {
  let timer: NodeJS.Timeout;
  return (event) => {
    event.preventDefault();
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func();
    }, delay);
  };
};
