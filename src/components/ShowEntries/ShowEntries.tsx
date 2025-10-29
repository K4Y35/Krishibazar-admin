
import React from "react";

interface ShowEntriesProps {
  itemsPerPage: number;
  handleItemsPerPageChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
}

const ShowEntries: React.FC<ShowEntriesProps> = ({
  itemsPerPage,
  handleItemsPerPageChange,
}) => {
  return (
    <div>
      <span className="mr-2">Show</span>
      <select
        className="rounded border p-2"
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
      >
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={500}>500</option>
        <option value={700}>700</option>
        <option value={1000}>1000</option>
      </select>
      <span className="ml-2">Entries</span>
    </div>
  );
};

export default ShowEntries;
