"use client";
import React, { useEffect, useCallback, useMemo, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  User2,
} from "lucide-react";
import { User } from "@/types/user";
import useDebounce from "@/hooks/useDebounce";
import usePagination from "@/hooks/usePagination";
import useTableState from "@/hooks/useTableState";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/slices/users-slice";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, limit } = useSelector(
    (state: RootState) => state.users
  );

  const { state, updateState } = useTableState({
    page: 1,
    sortBy: "id" as keyof User,
    sortDirection: "asc" as "asc" | "desc",
    filter: "all",
    searchTerm: "",
  });

  const debouncedSearchTerm = useDebounce(state.searchTerm);

  const processedData = useMemo(() => {
    let result = [...data];

    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower)
      );
    }

    if (state.filter && state.filter !== "all") {
      result = result.filter((user) => user.gender === state.filter);
    }

    result.sort((a, b) => {
      const valueA = a[state.sortBy];
      const valueB = b[state.sortBy];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return state.sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return state.sortDirection === "asc"
          ? valueA - valueB
          : valueB - valueA;
      }

      return 0;
    });

    return result;
  }, [
    data,
    debouncedSearchTerm,
    state.filter,
    state.sortBy,
    state.sortDirection,
  ]);

  const pagination = usePagination({
    totalItems: processedData.length,
    itemsPerPage: limit,
    currentPage: state.page,
  });

  const paginatedData = useMemo(() => {
    return processedData.slice(pagination.startIndex, pagination.endIndex);
  }, [processedData, pagination.startIndex, pagination.endIndex]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateState({ searchTerm: e.target.value, page: 1 });
    },
    [updateState]
  );

  const handleFilter = useCallback(
    (value: string) => {
      updateState({ filter: value, page: 1 });
    },
    [updateState]
  );

  const handleSort = useCallback(
    (column: keyof User) => {
      updateState({
        sortBy: column,
        sortDirection:
          state.sortBy === column && state.sortDirection === "asc"
            ? "desc"
            : "asc",
        page: 1,
      });
    },
    [state.sortBy, state.sortDirection, updateState]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateState({ page: Math.min(newPage, pagination.totalPages) });
    },
    [updateState, pagination.totalPages]
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading)
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LoadingSpinner />
      </Suspense>
    );
  if (error)
    return (
      <Suspense fallback={<div>Loading error...</div>}>
        <ErrorDisplay message={error} />
      </Suspense>
    );

  const renderUserCell = (user: User) => (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        {user.image ? (
          <AvatarImage
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
          />
        ) : (
          <AvatarFallback className="bg-primary/10">
            <User2 className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-sm text-gray-500">@{user.username}</span>
      </div>
    </div>
  );

  const renderContactCell = (user: User) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center space-x-2">
        <Mail className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{user.email}</span>
      </div>
      {user.phone && (
        <span className="text-sm text-gray-500">{user.phone}</span>
      )}
    </div>
  );

  const renderDetailsCell = (user: User) => (
    <div className="flex flex-wrap gap-2">
      {user.gender && (
        <Badge variant="outline" className="capitalize">
          {user.gender}
        </Badge>
      )}
      {user.age && <Badge variant="outline">{user.age} years</Badge>}
      {user.birthDate && (
        <Badge variant="outline">
          {new Date(user.birthDate).toLocaleDateString()}
        </Badge>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Users List</h1>
      <div className="flex flex-col bg-white p-4 rounded-md shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Search users..."
            value={state.searchTerm}
            onChange={handleSearch}
            className="flex-grow"
          />
          <Select value={state.filter} onValueChange={handleFilter}>
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

        {processedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID
                    {state.sortBy === "id" ? (
                      state.sortDirection === "asc" ? (
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
            <TableBody>
              {paginatedData.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{renderUserCell(user)}</TableCell>
                  <TableCell>{renderContactCell(user)}</TableCell>
                  <TableCell>{renderDetailsCell(user)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Showing {pagination.startIndex + 1}-{pagination.endIndex}{" "}
                      of {processedData.length} results
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.isFirstPage}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={pagination.isLastPage}
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </div>
  );
}
