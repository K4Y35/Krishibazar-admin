"use client";

import React, {
  Children,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { SiteContext } from "@/context/SiteContext";
import DarkModeSwitcher from "../Header/DarkModeSwitcher";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups: any = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
        label: "Dashboard",
        route: "/",
        permission_key: "dashboard",
      },
      {
        icon: (
          <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        
        ),
        label: "Manage Users",
        route: "",
        children: [
          {
            label: "All Users",
            route: "/manage-users/all-users",
            permission_key: "manage_users",
          },
          {
            label: "Pending Users",
            route: "/manage-users/pending-users",
            permission_key: "manage_users",
          },
          
        ],
        permission_key: "manage_users",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
        label: "Investments",
        route: "",
        children: [
          {
            label: "All Investments",
            route: "/admin/investments",
            permission_key: "investment_management",
          },
          {
            label: "Pending Approval",
            route: "/admin/investments/pending",
            permission_key: "investment_management",
          },
          {
            label: "Payment Confirmation",
            route: "/admin/investments/payments",
            permission_key: "investment_management",
          },
        ],
        permission_key: "investment_management",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
        ),
        label: "Projects",
        route: "",
        children: [
          {
            label: "All Projects",
            route: "/admin/projects",
            permission_key: "project_management",
          },
          {
            label: "Add Project",
            route: "/admin/projects/add",
            permission_key: "project_management",
          },
          {
            label: "Pending Approval",
            route: "/admin/projects/pending",
            permission_key: "project_approval",
          },
        ],
        permission_key: "project_management",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        ),
        label: "Categories",
        route: "/admin/categories",
        permission_key: "project_management",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        ),
        label: "Products & Supplies",
        route: "/admin/products",
        permission_key: "product_management",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
            <path d="M3 6h18M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        ),
        label: "Orders",
        route: "/admin/orders",
        permission_key: "product_management",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ),
        label: "RBAC Settings",
        route: "",
        children: [
          {
            label: "Roles",
            route: "/admin/roles",
            permission_key: "rbac_management",
          },
          {
            label: "Permissions",
            route: "/admin/permissions",
            permission_key: "rbac_management",
          },
          {
            label: "Admin Management",
            route: "/admin/manage-admins",
            permission_key: "rbac_management",
          },
        ],
        permission_key: "rbac_management",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { permissions, user } = useContext(SiteContext);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filterMenuItems = (menuItems: any[]) => {
    return menuItems
      .map((menuItem) => {
        const labelMatch = menuItem.label.toLowerCase().includes(searchQuery);

        let filteredChildren = [];
        if (menuItem.children) {
          filteredChildren = menuItem.children.filter((child: any) =>
            child.label.toLowerCase().includes(searchQuery),
          );
        }

        if (labelMatch || filteredChildren.length > 0) {
          return {
            ...menuItem,
            children:
              filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-primaryBlue duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              className="dark:hidden"
              width={100}
              height={32}
              src={"/images/logo/logo.png"}
              alt="Logo"
              priority
            />
            <Image
              className="hidden dark:block"
              width={100}
              height={32}
              src={"/images/logo/logo.png"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            <div className="mb-10 w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full rounded-2xl bg-[#18202F] px-10 py-2 text-white focus:outline-none dark:bg-boxdark"
                />
                <Image
                  src={"/images/icon/search.png"}
                  width={20}
                  height={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
                  alt="search icon"
                />
              </div>
            </div>
            {menuGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex}>
                <h3 className="mb-5 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {filterMenuItems(group.menuItems)
                    .filter(
                      (menuItem: any) =>
                        user?.username === "superadmin" ||
                        (Array.isArray(permissions) &&
                          permissions.length > 0 &&
                          permissions.some(
                            (perm: any) =>
                              perm.permission_key === menuItem.permission_key,
                          )),
                    )
                    .map((menuItem: any, menuIndex: number) => (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    ))}
                </ul>
              </div>
            ))}
            <DarkModeSwitcher />
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
