import axios from "axios";

const axiosFetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default axiosFetch;
