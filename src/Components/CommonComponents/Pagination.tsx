import { Buttons } from './Buttons'
import type { paginationProps } from '../../types'

function Pagination ({ currentPage, totalPages, onPageChange }: paginationProps) {
  return (
    <div>
        <div className="pagination-controls">
                <Buttons
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    label="Previous"
                    type='button'
                    className="pagination-button"
                />
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <Buttons
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    label="Next"
                    type='button'
                    className="pagination-button"
                />
        </div>
    </div>
  )
}

export default Pagination
