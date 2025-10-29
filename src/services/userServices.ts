import request from "./httpServices";
import apiUrls from "@/config/apiUrls";

const userService = {
  adminLogin: async (body: any) => {
    // console.log("body", body);
    return request.post(apiUrls.auth.login, body);
  },

  getAllUsers: async () => {
    return request.get(apiUrls.user.allUsers);
  },
  getUserById: async (id: number | string) => {
    return request.get(apiUrls.user.details + `/${id}`);
  },
  approveUser: async (id: number | string) => {
    return request.get(apiUrls.user.approve + `/${id}`);
  },
};


export default userService;
