import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFiltersProps {
  searchTerm: string;
  filter: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (value: string) => void;
}

export function UserFilters({
  searchTerm,
  filter,
  onSearchChange,
  onFilterChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={onSearchChange}
        className="flex-grow"
      />
      <Select value={filter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter By Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
