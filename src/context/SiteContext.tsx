import { useRouter } from "next/navigation";
import React, {
  createContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";

export const SiteContext = createContext<any>(null);

interface SiteProviderProps {
  children: ReactNode;
}

export const SiteProvider = ({ children }: SiteProviderProps) => {
  const logout: any = () => {
    setToken(null);
    setUser(null);
    setPermissions(null);
    setLogoutModalOpen(false);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_permissions");
    router.push("/login");
  };

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [permissions, setPermissions] = useState<any>(null);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    console.log(user, token, "user and token");
    if (user && token) {
    }
    if (user && user.username !== "superadmin") {
      getPermissions();
      console.log("get permissions");
    }
  }, [user, token]);

  const getPermissions = async () => {
    const userPermissions: any = localStorage.getItem("admin_permissions");
    setPermissions(JSON.parse(userPermissions));
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      theme,
      setTheme,
      toggleTheme,
      logout,
      profile,
      setProfile,
      permissions,
      setPermissions,
      isLogoutModalOpen,
      setLogoutModalOpen,
    }),
    [
      user,
      setUser,
      token,
      setToken,
      theme,
      setTheme,
      toggleTheme,
      logout,
      profile,
      setProfile,
      permissions,
      setPermissions,
      isLogoutModalOpen,
      setLogoutModalOpen,
    ],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};
