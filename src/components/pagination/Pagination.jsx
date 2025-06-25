/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */

import { CPagination, CPaginationItem } from "@coreui/react"

const Pagination = ({
    currentPage,
    setCurrentPage,
    totalPage,
    data,
}) => {
  return (
    <CPagination className="justify-content-center">
      {/* Previous Button */}
      <CPaginationItem
        disabled={currentPage === 1 || data.length === 0}
        onClick={() => currentPage > 1 && setCurrentPage(1)}
      >
        First
      </CPaginationItem>
      <CPaginationItem
        disabled={currentPage === 1 || data.length === 0}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      >
        Previous
      </CPaginationItem>

      {/* Page Numbers */}
      {Array.from({ length: totalPage }, (_, i) => i + 1)
        .slice(
          Math.max(0, currentPage - 2), // Start index for slicing
          Math.min(totalPage, currentPage + 1), // End index for slicing
        )
        .map((page) => (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </CPaginationItem>
        ))}

      {/* Next Button */}
      <CPaginationItem
        disabled={currentPage === totalPage || data.length === 0}
        onClick={() => currentPage < totalPage && setCurrentPage(currentPage + 1)}
      >
        Next
      </CPaginationItem>
      <CPaginationItem
        disabled={currentPage === totalPage || data.length === 0}
        onClick={() => currentPage < totalPage && setCurrentPage(totalPage)}
      >
        Last
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
