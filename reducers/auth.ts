import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { PayloadAction } from "@reduxjs/toolkit";

function destroyToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export type NewUser = {
  phonenumber: number | string;
  name: string;
  email: string;
  password: string;
};

export type OwnUser = {
  id: number;
  name: string;
  email: string;
  phonenumber: string;
};

export type LoginObg = {
  email: string;
  password: string;
  navigate: any;
};

export interface LoginAnswer {
  accessToken: string;
  refreshToken: string;
}

interface IAuth {
  loading: boolean;
  users: OwnUser[];
}

const initialState: IAuth = {
  loading: false,
  users: [],
};

interface GetUsersResponse {
  data: OwnUser[];
}

const axiosMockSwager = axios.create({
  baseURL: "http://2.56.213.92:5001/api",
});

export const axiosAuthorized = axios.create({
  baseURL: "http://2.56.213.92:5001/api",
});

axiosAuthorized.interceptors.request.use(
  (config: any) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAuthorized.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        destroyToken();
        return Promise.reject(error);
      }
      try {
        const { data } = await axiosMockSwager.post(`/refresh`, {
          token: refreshToken,
        });
        localStorage.setItem("accessToken", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        destroyToken();
        return Promise.reject(err);
      }
    }
    destroyToken();
    return Promise.reject(error);
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (body: NewUser, { dispatch }) => {
    try {
      const { data } = await axiosMockSwager.post<string>("register", body);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (body: LoginObg, { dispatch }) => {
    let { navigate, ...user } = body;
    try {
      const { data } = await axiosMockSwager.post<LoginAnswer>("login", user);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate.push("/users");
      console.log();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUsers = createAsyncThunk(
  "auth/getUsers",
  async (_, { dispatch }) => {
    try {
      const { data } = await axiosAuthorized.get<GetUsersResponse>("/users");
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(
      registerUser.pending,
      (state: IAuth, action: PayloadAction<string | number>) => {
        state.loading = true;
      }
    );
    builder.addCase(
      registerUser.fulfilled,
      (state: IAuth, action: PayloadAction<string | number>) => {
        state.loading = false;
      }
    );
    builder.addCase(
      registerUser.rejected,
      (state: IAuth, action: PayloadAction<string | number>) => {
        state.loading = false;
      }
    );

    builder.addCase(
      getUsers.pending,
      (state: IAuth, action: PayloadAction<string | number>) => {
        state.loading = true;
      }
    );
    builder.addCase(
      getUsers.fulfilled,
      (state: IAuth, action: PayloadAction<OwnUser[]>) => {
        state.loading = false;
        state.users = action.payload;
      }
    );
    builder.addCase(
      getUsers.rejected,
      (state: IAuth, action: PayloadAction<string | number>) => {
        state.loading = false;
      }
    );
  },
});

export default authSlice.reducer;
