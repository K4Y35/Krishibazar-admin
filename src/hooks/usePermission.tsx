import { useContext } from "react";
import { SiteContext } from "@/context/SiteContext";

export const usePermission = () => {
  const { user, permissions } = useContext<any>(SiteContext);

  const hasPermission = (permissionKey: string): boolean => {
    // Superadmin has all permissions
    if (user?.username === "superadmin") {
      return true;
    }

    // Check if user has the permission
    if (!permissions || !Array.isArray(permissions)) {
      return false;
    }

    return permissions.some(
      (perm: any) => perm.permission_key === permissionKey
    );
  };

  const hasAnyPermission = (permissionKeys: string[]): boolean => {
    return permissionKeys.some((key) => hasPermission(key));
  };

  const hasAllPermissions = (permissionKeys: string[]): boolean => {
    return permissionKeys.every((key) => hasPermission(key));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin: user?.username === "superadmin",
  };
};

