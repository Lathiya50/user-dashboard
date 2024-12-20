"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody } from "@/components/ui/table";
import { User } from "@/types/user";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/slices/users-slice";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import useDebounce from "@/hooks/useDebounce";
import usePagination from "@/hooks/usePagination";
import useTableState from "@/hooks/useTableState";
import { UserTableHeader } from "@/components/users/UserTableHeader";
import { UserTableRow } from "@/components/users/UserTableRow";
import { UserTableFooter } from "@/components/users/UserTableFooter";
import { UserFilters } from "@/components/users/UserFilters";

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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Users List</h1>
      <div className="flex flex-col bg-white p-4 rounded-md shadow-sm">
        <UserFilters
          searchTerm={state.searchTerm}
          filter={state.filter}
          onSearchChange={handleSearch}
          onFilterChange={handleFilter}
        />

        {processedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria
          </div>
        ) : (
          <Table>
            <UserTableHeader
              sortBy={state.sortBy}
              sortDirection={state.sortDirection}
              onSort={handleSort}
            />
            <TableBody>
              {paginatedData.map((user) => (
                <UserTableRow key={user.id} user={user} />
              ))}
            </TableBody>
            <UserTableFooter
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={processedData.length}
              currentPage={pagination.currentPage}
              isFirstPage={pagination.isFirstPage}
              isLastPage={pagination.isLastPage}
              onPageChange={handlePageChange}
            />
          </Table>
        )}
      </div>
    </div>
  );
}
