export default {
  get API_URL() {
    return import.meta.env.VITE_API_URL;
  },
  get IMAGE_URL() {
    return import.meta.env.IMAGE_URL;
  },
};
