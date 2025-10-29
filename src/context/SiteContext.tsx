import userService from "@/services/userServices";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useState,
  ReactNode,
  useMemo,
  useEffect
} from "react";

// Create the context
export const SiteContext = createContext<any>(null);

// Define the provider props
interface SiteProviderProps {
  children: ReactNode;
}

// Create the provider component
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
      // getProfile();
    }
    if (user && user.username !== "superadmin") {
      getPermissions();
      console.log("get permissions");
    }
  }, [user, token]);

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCurrency") || "GMD";
    }
    return "GMD";
  });

  const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCryptoCurrency") || "USDT";
    }
    return "USDT";
  });

  const [selectedCryptoCurrencyId, setSelectedCryptoCurrencyId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedCryptoCurrencyId");
      return stored ? parseInt(stored) : 1;
    }
    return 1;
  });

  useEffect(() => {
    if (selectedCurrency) {
      localStorage.setItem("selectedCurrency", selectedCurrency);
      console.log("selected currency saved:", selectedCurrency);
    }
  }, [selectedCurrency]);

  
  // const getProfile = async () => {
  //   if (localStorage.getItem("gcpayadminuser")) {
  //     const response = await userService.getMyProfile();
  //     setProfile(response);
  //   }
  // };

  const getPermissions = async () => {
    const userPermissions: any = localStorage.getItem("admin_permissions");
    // console.log('userPermissions: ', JSON.parse(userPermissions));
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
      selectedCurrency,
      setSelectedCurrency,
      isLogoutModalOpen,
      setLogoutModalOpen,
      selectedCryptoCurrency,
      setSelectedCryptoCurrency,
      selectedCryptoCurrencyId,
      setSelectedCryptoCurrencyId,
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
      selectedCurrency,
      setSelectedCurrency,
      isLogoutModalOpen,
      setLogoutModalOpen,
      selectedCryptoCurrency,
      setSelectedCryptoCurrency,
      selectedCryptoCurrencyId,
      setSelectedCryptoCurrencyId,
    ],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};
