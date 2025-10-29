import React from "react";
import AppButton from "../Buttons/AppButton";
import CancelButton from "../Buttons/CancelButton";
import AppButtonFull from "../Buttons/AppButtonFull";
import CancelButtonOutlined from "../Buttons/CancelButtonOutlined";

const MainModal = ({
  title,
  btnTitle,
  actionbtn,
  cancelTitle,
  setModalOpen,
  children,
  size = "md",
  loading = false,
}: any) => {
  return (
    <>
      <div
        id="default-modal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed left-0 top-0 right-0 inset-0 z-[999] w-full h-full flex items-center justify-center overflow-y-auto overflow-x-hidden bg-[#0000006b] p-4"
      >
        <div className="relative w-full max-w-[95%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <div className="relative flex w-full flex-col rounded-3xl border-0 bg-white shadow-lg outline-none focus:outline-none dark:bg-gray-700">
            <div className="flex items-start justify-between rounded-t p-5">
              <h3 className="text-3xl font-semibold text-gray-700 dark:text-white">
                {title}
              </h3>
              <button
                className="float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none outline-none focus:outline-none"
                onClick={() => setModalOpen(false)}
              >
                <span className="block h-6 w-6 bg-transparent text-2xl text-[#D5145A] outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="relative flex-auto px-6 text-left">{children}</div>
            <div className="flex flex-col items-center justify-end rounded-b p-6">
              {btnTitle && (
                <AppButtonFull
                  text={btnTitle}
                  action={actionbtn}
                  type={"button"}
                  loading={loading}
                />
              )}

              {cancelTitle && (
                <CancelButtonOutlined
                  text={cancelTitle}
                  action={() => setModalOpen(false)}
                  disabled={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainModal;
