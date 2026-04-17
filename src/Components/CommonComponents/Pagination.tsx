import { Buttons } from "./Buttons";
import type { paginationProps } from "../../Interface/types";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: paginationProps) {
  return (
    <div>
      <div className="pagination-controls">
        <Buttons
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          label="Previous"
          className="pagination-button"
        />
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Buttons
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          label="Next"
          className="pagination-button"
        />
      </div>
    </div>
  );
}

export default Pagination;
