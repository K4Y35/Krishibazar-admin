import userService from "@/services/userServices";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { SiteContext } from "@/context/SiteContext";
import toast from "react-hot-toast";

const useLoginSubmit = () => {
  const { setUser, setToken, setPermissions } = useContext<any>(SiteContext);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  

  const onSubmit = async (values: any) => {
    try {
      const response = await userService.adminLogin(values);

      console.log(response.token, "response.token");
      // Save the token in localStorage
      localStorage.setItem("admin_token", response.token);
      localStorage.setItem("admin_user", JSON.stringify(response.user));
      localStorage.setItem("admin_permissions", JSON.stringify(response.permissions));
      setUser(response.user);
      setToken(response.token);
      setPermissions(response.permissions);

      router.push("/");
    } catch (error: any) {
      setError("username", {
        type: "manual",
        message:
          error.response?.data?.message || "Incorrect username or password.",
      });
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};

export default useLoginSubmit;
