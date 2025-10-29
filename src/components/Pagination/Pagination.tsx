"use client";

import { useState } from "react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else {
        startPage = Math.max(1, endPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 rounded px-3 py-1 ${
            currentPage === i
              ? "bg-[#E9413E] text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  return (
    <div className="mt-10 flex items-center justify-end">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 rounded-lg border border-primaryBorder px-4 py-2 text-base font-medium text-black disabled:opacity-50 dark:text-white"
      >
        Previous
      </button>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 rounded-lg border border-primaryBorder px-4 py-2 text-base font-medium text-black disabled:opacity-50 dark:text-white"
      >
        Next
      </button>

      <p className="ml-6 text-base font-medium text-black dark:text-white">
        Showing 1-{itemsPerPage > totalItems ? totalItems : itemsPerPage} of{" "}
        {totalItems}
      </p>
    </div>
  );
};

export default Pagination;
