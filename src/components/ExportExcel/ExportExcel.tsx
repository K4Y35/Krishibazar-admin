import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ExportExcelProps {
  data: Array<{ [key: string]: any }>;
  fileName?: string;
  buttonText?: string;
  className?: string;
}

const ExportExcel: React.FC<ExportExcelProps> = ({
  data,
  fileName = "exported_data",
  buttonText = "Excel",
}) => {
  const exportToExcel = () => {
    try {
      console.log(data);

      const worksheet = XLSX.utils.json_to_sheet(data);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(dataBlob, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      className={`flex h-[42px] min-w-[130px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="16"
        height="16"
        className="fill-current"
      >
        <path d="M28.875 0C28.855469 0.0078125 28.832031 0.0195313 28.8125 0.03125L0.8125 5.34375C0.335938 5.433594 -0.0078125 5.855469 0 6.34375L0 43.65625C-0.0078125 44.144531 0.335938 44.566406 0.8125 44.65625L28.8125 49.96875C29.101563 50.023438 29.402344 49.949219 29.632813 49.761719C29.859375 49.574219 29.996094 49.296875 30 49L30 44L47 44C48.09375 44 49 43.09375 49 42L49 8C49 6.90625 48.09375 6 47 6L30 6L30 1C30.003906 0.710938 29.878906 0.4375 29.664063 0.246094C29.449219 0.0546875 29.160156 -0.0351563 28.875 0ZM28 2.1875L28 6.53125C27.867188 6.808594 27.867188 7.128906 28 7.40625L28 42.8125C27.972656 42.945313 27.972656 43.085938 28 43.21875L28 47.8125L2 42.84375L2 7.15625ZM30 8L47 8L47 42L30 42L30 37L34 37L34 35L30 35L30 29L34 29L34 27L30 27L30 22L34 22L34 20L30 20L30 15L34 15L34 13L30 13ZM36 13L36 15L44 15L44 13ZM6.6875 15.6875L12.15625 25.03125L6.1875 34.375L11.1875 34.375L14.4375 28.34375C14.664063 27.761719 14.8125 27.316406 14.875 27.03125L14.90625 27.03125C15.035156 27.640625 15.160156 28.054688 15.28125 28.28125L18.53125 34.375L23.5 34.375L17.75 24.9375L23.34375 15.6875L18.65625 15.6875L15.6875 21.21875C15.402344 21.941406 15.199219 22.511719 15.09375 22.875L15.0625 22.875C14.898438 22.265625 14.710938 21.722656 14.5 21.28125L11.8125 15.6875ZM36 20L36 22L44 22L44 20ZM36 27L36 29L44 29L44 27ZM36 35L36 37L44 37L44 35Z" />
      </svg>
      {buttonText}
    </button>
  );
};

export default ExportExcel;
