import { TableFooter, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserTableFooterProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  onPageChange: (page: number) => void;
}

export function UserTableFooter({
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  isFirstPage,
  isLastPage,
  onPageChange,
}: UserTableFooterProps) {
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={4}>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{endIndex} of {totalItems} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isFirstPage}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLastPage}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
