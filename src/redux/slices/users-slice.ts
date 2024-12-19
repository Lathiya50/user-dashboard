
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, UserApiResponse } from '@/types/user';
import { RootState } from '../store';

interface UsersState {
  data: User[];
  loading: boolean;
  error: string | null;
  limit: number;
  lastFetched: number | null;
  cache: {
    [key: string]: {
      data: User[];
      timestamp: number;
    };
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
  limit: 10,
  lastFetched: null,
  cache: {},
};

const generateCacheKey = (params: Record<string, string | number | boolean>) => {
  return Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
};

export const fetchUsers = createAsyncThunk<
  User[], 
  void, 
  { state: RootState }
>(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    const state = getState().users;
    const now = Date.now();

    if (state.lastFetched && (now - state.lastFetched < CACHE_DURATION)) {
      return state.data;
    }

    try {
      const response = await axios.get<UserApiResponse>('https://dummyjson.com/users', {
        headers: {
          'Cache-Control': 'max-age=300',
          'If-None-Match': localStorage.getItem('usersEtag') || '',
        }
      });

      const etag = response.headers['etag'];
      if (etag) {
        localStorage.setItem('usersEtag', etag);
      }
      
      return response.data.users;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 304 && state.data.length > 0) {
          return state.data;
        }
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
  {
    condition: (_, { getState }) => {
      const { users } = getState();
      const now = Date.now();
      
      if (users.loading) {
        return false;
      }

      if (users.lastFetched && (now - users.lastFetched < CACHE_DURATION)) {
        return false;
      }

      return true;
    }
  }
);

export const fetchFilteredUsers = createAsyncThunk<
  User[],
  { filter: string; search: string },
  { state: RootState }
>(
  'users/fetchFilteredUsers',
  async (params, { getState, dispatch }) => {
    const state = getState().users;
    const cacheKey = generateCacheKey(params);
    const now = Date.now();

    const cachedData = state.cache[cacheKey];
    if (cachedData && (now - cachedData.timestamp < CACHE_DURATION)) {
      return cachedData.data;
    }

    const allUsers = await dispatch(fetchUsers()).unwrap();
    
    let filteredUsers = [...allUsers];
    
    if (params.filter) {
      filteredUsers = filteredUsers.filter(user => user.gender === params.filter);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    }

    return filteredUsers;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCache: (state) => {
      state.cache = {};
      state.lastFetched = null;
      localStorage.removeItem('usersEtag');
    },
    invalidateCache: (state) => {
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch users';
      })
      .addCase(fetchFilteredUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        
        const cacheKey = generateCacheKey(action.meta.arg);
        state.cache[cacheKey] = {
          data: action.payload,
          timestamp: Date.now()
        };
      })
      .addCase(fetchFilteredUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch filtered users';
      });
  },
});

export const { clearCache, invalidateCache } = usersSlice.actions;
export default usersSlice.reducer;