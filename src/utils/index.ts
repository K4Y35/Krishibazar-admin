import apiUrls from "@/config/apiUrls";

export const getImagePath = (path: string) => {
  if(path){
    return `${apiUrls.base_url}/uploads/${path}`;
  } else {
    return "/images/noimage.png";
  }
}

export const getPreviewImage = (path: string) => {
  console.log(path);
  if(path){
    return `${apiUrls.base_url}/uploads/${path}`;
  } else {
    return "/images/preview.png";
  }
}

export const convertStatusToText = (value: number) => {
  const statusMap: Record<number, string> = {
    0: "Email Verification",
    1: "Password Setup",
    2: "KYC Verification",
    3: "Verified",
    4: "Temporary Hold",
    5: "Blocked",
  };

  return statusMap[value] || "Created";
};

export const convertKycStatusToText = (value: number): string => {
  const statusMap: Record<number, string> = {
    0: "Pending",
    1: "Approved",
    2: "Rejected",
  };

  return statusMap[value] ?? "Not Created";
};

export const convertReviewCompleteStatusToText = (value: number) => {
  const statusMap: Record<number, string> = {
    1: "Approved",
    2: "Rejected"
  };

  return statusMap[value] || "Pending";
}

export const convertSupportTicketStatusToText = (value: number): string => {
  const statusMap: Record<number, string> = {
    0: "Open",
    1: "In Progress",
    2: "Closed",
  };

  return statusMap[value] ?? "Unknown Status";
};

export const convertSupportTicketReplyStatusToText = (value: number): string => {
  const statusMap: Record<number, string> = {
    0: "Waiting for admin",
    1: "Waiting for agency",
  };

  return statusMap[value] ?? "Unknown Status";
};

export const supportTicketStatusColor = (value: number): string => {
  const colorMap: Record<number, string> = {
    0: "bg-yellow-500",
    1: "bg-blue-500",
    2: "bg-green-500",
  };

  return colorMap[value] ?? "bg-gray-500";
};

export const convertTransactinStatusToText = (value: number): string => {
  const statusMap: Record<number, string> = {
    1: "Success",
    2: "Failed",
    3: "Cancelled",
    4: "Refund",
    5: "Hold"
  };

  return statusMap[value] || "Pending";
};

export const convertRequestStatusToText = (value: number): string => {
  const statusMap: Record<number, string> = {
    1: "Accepted",
    2: "Rejected",
    0: "Pending",
  };

  return statusMap[value] || "Pending";
}

export const getRouteNameByPermissionKey = (value: string): string => {
  const routeMap: Record<string, string> = {
    dashboard: "/",
    manage_admin: "admin/manage-admin",
    manage_roles: "roles/manage-roles",
    manage_faqs: "faq/manage-faq",
    users: "users/manage-users",
    agency: "agency/manage-agency",
    activity_log: "activity/admin-log",
    agency_transaction: "deposit/transaction",
    agency_reports: "agency-report/deposit-report",
    user_reports: "user-report/deposit-report",
    app_notification: "app-notification",
    settings: "settings/email-settings",
    supporttickets: "user-support-ticket",
    marketing: "marketing/promotional-banner",
    agency_deposit: "deposit",
    agency_withdraw: "withdraw",
  };

  return routeMap[value];
};

export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const formatAmount = (amount: number, isSetCurrency: boolean = true, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: isSetCurrency ? "currency" : "decimal",
    currency,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
