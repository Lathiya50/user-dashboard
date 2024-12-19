import { useState } from 'react';
import { User } from '@/types/user';

interface TableState {
  page: number;
  sortBy: keyof User;
  sortDirection: 'asc' | 'desc';
  filter: string;
  searchTerm: string;
}

export default function useTableState(initialState: TableState) {
  const [state, setState] = useState(initialState);
  
  const updateState = (newState: Partial<TableState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  return {
    state,
    updateState
  };
}