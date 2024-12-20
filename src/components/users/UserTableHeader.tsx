import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { User } from "@/types/user";

interface UserTableHeaderProps {
  sortBy: keyof User;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof User) => void;
}

export function UserTableHeader({
  sortBy,
  sortDirection,
  onSort,
}: UserTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => onSort("id")}
        >
          <div className="flex items-center">
            ID
            {sortBy === "id" ? (
              sortDirection === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </div>
        </TableHead>
        <TableHead>User Info</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Details</TableHead>
      </TableRow>
    </TableHeader>
  );
}
