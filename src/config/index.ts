export default {
  get API_URL() {
    return import.meta.env.VITE_API_URL;
  },
  get VITE_IMAGE_URL() {
    return import.meta.env.VITE_IMAGE_URL;
  },
};
