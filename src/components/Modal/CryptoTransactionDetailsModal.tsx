import React, { useState } from "react";
import MainModal from "./MainModal";
import { FaCoins, FaCopy, FaCheck } from "react-icons/fa6";
import { formatDateTime } from "@/utils/datehelper";

interface CryptoTransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: any | null;
  onReprocess?: () => void;
  loading?: boolean;
}

const CryptoTransactionDetailsModal: React.FC<
  CryptoTransactionDetailsModalProps
> = ({ isOpen, onClose, details, onReprocess, loading = false }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !details) return null;

  const status = Number(details.transaction_status);
  const isSuccess = status === 3;
  const isFailed = status === 4;

  // Check if this is a recovery result view
  const isRecoveryResult = details._view === "recovery_result";

  // Check recovery status
  const recoverySuccess = details.recovery_status === "COMPLETED";
  const recoveryFailed =
    details.recovery_status === "FAILED" ||
    details.message?.includes("Internal server error");

  const requestedAmount = details?.requested_amount
    ? Number(details.requested_amount)
    : undefined;

  const sentAmount = details?.transaction_amount
    ? Number(details.transaction_amount)
    : undefined;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <MainModal
      title={
        isRecoveryResult ? "Recovery Process Result" : "Crypto Deposit Details"
      }
      btnTitle={isRecoveryResult ? undefined : "Re Process"}
      actionbtn={isRecoveryResult ? undefined : onReprocess}
      setModalOpen={onClose}
      cancelTitle="Close"
      loading={loading}
    >
      <div className="space-y-3 text-center">
        {isRecoveryResult && (
          <div
            className={`rounded-xl border p-4 shadow-sm ${
              recoverySuccess
                ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                : "border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {recoverySuccess ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 dark:bg-green-400">
                  <FaCheck className="h-3 w-3 text-white" />
                </div>
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 dark:bg-red-400">
                  <FaCheck className="h-3 w-3 text-white" />
                </div>
              )}
              <h5
                className={`text-lg font-semibold ${
                  recoverySuccess
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {recoverySuccess ? "Recovery Successful!" : "Recovery Failed"}
              </h5>
            </div>
            {details.message && (
              <p
                className={`mt-2 text-sm ${
                  recoverySuccess
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {details.message}
              </p>
            )}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-boxdark-2">
          <h5 className="mb-2 flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            <div
              className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full ${
                isRecoveryResult && recoverySuccess
                  ? "bg-green-100 dark:bg-green-900/30"
                  : isRecoveryResult && recoveryFailed
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-primaryPink/20"
              }`}
            >
              <FaCoins
                className={`h-3 w-3 ${
                  isRecoveryResult && recoverySuccess
                    ? "text-green-600 dark:text-green-400"
                    : isRecoveryResult && recoveryFailed
                      ? "text-red-600 dark:text-red-400"
                      : "text-primaryPink"
                }`}
              />
            </div>
            {isRecoveryResult ? "Recovery Details" : "Deposit Details"}
          </h5>

          <div className="space-y-1.5">
            {/* Error Details for Failed Recovery */}
            {isRecoveryResult && recoveryFailed && details.error && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-700 dark:bg-red-900/20">
                <div className="flex items-start space-x-2">
                  <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 dark:bg-red-400">
                    <FaCheck className="h-2 w-2 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error Details:
                    </p>
                    <p className="font-mono mt-1 break-all text-xs text-red-700 dark:text-red-300">
                      {details.error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {details.message && !isRecoveryResult && (
              <div className="mb-2 rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-left dark:border-gray-600 dark:bg-gray-800/50">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {details.message}
                </p>
              </div>
            )}

            {details.network_name && (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deposit Network:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {details.network_name}
                </span>
              </div>
            )}

            {details.user_details && (
              <div className="space-y-1.5 rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {`${details.user_details.first_name || ""} ${details.user_details.last_name || ""}`.trim()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tahweel ID:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {details.user_details.tahweel_id || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {details.user_details.email || "-"}
                  </span>
                </div>
              </div>
            )}

            {details.deposit_address && (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deposit Address:
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono flex-1 whitespace-normal break-all text-right text-sm text-gray-600 dark:text-gray-400">
                    {details.deposit_address}
                  </span>
                </div>
              </div>
            )}

            {(details.transaction_hash ||
              (isRecoveryResult && details.original_tx_hash)) && (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isRecoveryResult
                    ? "Original Transaction Hash:"
                    : "Transaction Hash:"}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono flex-1 whitespace-normal break-all text-right text-sm text-gray-600 dark:text-gray-400">
                    {isRecoveryResult
                      ? details.original_tx_hash
                      : details.transaction_hash}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        isRecoveryResult
                          ? details.original_tx_hash
                          : details.transaction_hash,
                        "transaction_hash",
                      )
                    }
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    title="Copy Transaction Hash"
                  >
                    {copiedField === "transaction_hash" ? (
                      <FaCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <FaCopy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {requestedAmount !== undefined && (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requested Amount:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {details.crypto_currency_code} {requestedAmount.toFixed(4)}
                </span>
              </div>
            )}

            {sentAmount !== undefined && (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                <span className="text-sm font-medium text-primaryPink">
                  Amount:
                </span>
                <span className="text-sm font-semibold text-primaryPink">
                  {details.crypto_currency_code} {sentAmount.toFixed(4)}
                </span>
              </div>
            )}

            {details.transaction_fee_amount && (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transaction Fee:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {details.crypto_currency_code}{" "}
                  {details.transaction_fee_amount}
                </span>
              </div>
            )}

            {details.fxrate &&
              details.gcpay_currency_code &&
              sentAmount !== undefined && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Conversion Rate:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    1 {details.crypto_currency_code} = {details.fxrate}{" "}
                    {details.gcpay_currency_code}
                  </span>
                </div>
              )}

            {details.fxrate &&
              details.gcpay_currency_code &&
              sentAmount !== undefined && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Deposited to Your Account:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {details.gcpay_currency_code}{" "}
                    {(sentAmount * parseFloat(details.fxrate)).toFixed(4)}
                  </span>
                </div>
              )}

            {details.updated_at && (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isSuccess
                    ? "Completed:"
                    : isFailed
                      ? "Failed:"
                      : "Last Updated:"}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDateTime(details.updated_at)}
                </span>
              </div>
            )}

            {/* Enhanced Recovery Result Section */}
            {isRecoveryResult && (
              <div className="mt-4 space-y-2 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-boxdark-2">
                <h6 className="text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Recovery Process Details
                </h6>

                {details.recovery_status && (
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status:
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        recoverySuccess
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {details.recovery_status}
                    </span>
                  </div>
                )}

                {details.new_tx_hash && (
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Transaction:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono max-w-[120px] truncate text-xs text-gray-600 dark:text-gray-400">
                        {details.new_tx_hash}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(details.new_tx_hash, "new_tx_hash")
                        }
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="Copy New Transaction Hash"
                      >
                        {copiedField === "new_tx_hash" ? (
                          <FaCheck className="h-3 w-3 text-green-500" />
                        ) : (
                          <FaCopy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {details.transfer_hash && (
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transfer Hash:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono max-w-[120px] truncate text-xs text-gray-600 dark:text-gray-400">
                        {details.transfer_hash}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            details.transfer_hash,
                            "transfer_hash",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="Copy Transfer Hash"
                      >
                        {copiedField === "transfer_hash" ? (
                          <FaCheck className="h-3 w-3 text-green-500" />
                        ) : (
                          <FaCopy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {details.approval_hash && (
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Approval Hash:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono max-w-[120px] truncate text-xs text-gray-600 dark:text-gray-400">
                        {details.approval_hash}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            details.approval_hash,
                            "approval_hash",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        title="Copy Approval Hash"
                      >
                        {copiedField === "approval_hash" ? (
                          <FaCheck className="h-3 w-3 text-green-500" />
                        ) : (
                          <FaCopy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {typeof sentAmount === "undefined" &&
                  typeof details.transaction_amount !== "undefined" && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                      <span className="text-sm font-medium text-primaryPink">
                        Amount:
                      </span>
                      <span className="text-sm font-semibold text-primaryPink">
                        {details.crypto_currency_code}{" "}
                        {Number(details.transaction_amount).toFixed(4)}
                      </span>
                    </div>
                  )}

                {/* Additional recovery details */}
                {details.details?.depositDetails && (
                  <div className="mt-3 space-y-1.5 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-800/50">
                    <h6 className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Deposit Details
                    </h6>
                    <div className="space-y-1">
                      {details.details.depositDetails.balance !== undefined && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Balance:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {details.details.depositDetails.balance}
                          </span>
                        </div>
                      )}
                      {details.details.depositDetails.tokenBalance !==
                        undefined && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Token Balance:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {details.details.depositDetails.tokenBalance}
                          </span>
                        </div>
                      )}
                      {details.details.depositDetails.expectedAmount && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Expected Amount:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {details.details.depositDetails.expectedAmount}
                          </span>
                        </div>
                      )}
                      {details.details.depositDetails.usdtDeposited && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            USDT Deposited:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {details.details.depositDetails.usdtDeposited}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default CryptoTransactionDetailsModal;
