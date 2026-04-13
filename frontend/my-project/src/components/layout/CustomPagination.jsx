import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

const CustomPagination = ({ resPerPage, filteredProductCount }) => {
  // ✅ Fix for Vite + CommonJS issue
  const PaginationComponent = ReactPaginate?.default || ReactPaginate;

  const [currentPage, setCurrentPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Get page from URL
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setCurrentPage(page - 1); // react-paginate uses 0-based index
  }, [page]);

  // ✅ Total pages
  const pageCount = Math.ceil(filteredProductCount / resPerPage);

  // ✅ Page change handler
  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;

    setCurrentPage(data.selected);
    setSearchParams({ page: selectedPage });
  };

  return (
    <>
      {filteredProductCount > resPerPage && (
        <div className="d-flex justify-content-center mt-4">
          <PaginationComponent
            pageCount={pageCount}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            previousLabel="Prev"
            nextLabel="Next"
            breakLabel="..."
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
          />
        </div>
      )}
    </>
  );
};

export default CustomPagination;
