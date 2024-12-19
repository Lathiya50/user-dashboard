import { useMemo } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function usePagination({ totalItems, itemsPerPage, currentPage }: PaginationProps) {
  return useMemo(() => {
    const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
    
    const validCurrentPage = Math.min(currentPage, totalPages);
    
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentPage: validCurrentPage,
      isFirstPage: validCurrentPage === 1,
      isLastPage: validCurrentPage === totalPages,
      hasResults: totalItems > 0
    };
  }, [totalItems, itemsPerPage, currentPage]);
}