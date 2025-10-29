import axios from "axios";
import apiUrls from "@/config/apiUrls";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: `${apiUrls.base_url}`,
  timeout: 500000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config: any) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
    
    // Handle FormData - remove Content-Type to let browser set multipart boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']; // Let browser set multipart/form-data with boundary
    }
    
    return config;
  },
  (requestError) => {
    console.log(requestError?.response, "requestError");
    // Here probably need to have a return
    if (requestError?.response?.status == 401) {
      // navigation
    } else {
      return requestError;
    }
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 403) {
      // toast.error(error.response.data?.message || "You do not have permission!");
      // window.history.back();
    }
    if (error?.response?.status === 401) {
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
)

// console.log(process.env.API_BASE_URL);
const responseBody = (response: any) => response.data;

const requests = {
  get: (url: any) => instance.get(url).then(responseBody),
  post: (url: any, body: any, config?: any) => instance.post(url, body, config).then(responseBody),
  put: (url: any, body: any, config?: any) => instance.put(url, body, config).then(responseBody),
  delete: (url: any) => instance.delete(url).then(responseBody),
};

export default requests;
