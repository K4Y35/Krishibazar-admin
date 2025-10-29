"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePermission } from "@/hooks/usePermission";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function PermissionGuard({
  children,
  permission,
  fallback,
  redirectTo = "/",
}: PermissionGuardProps) {
  const { hasPermission, isSuperAdmin } = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!isSuperAdmin && !hasPermission(permission)) {
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [hasPermission, permission, isSuperAdmin, redirectTo, router]);

  if (isSuperAdmin || hasPermission(permission)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
}

