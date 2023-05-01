import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TTodo = {
  id: number | string;
  title: string;
  message: string;
  complete: boolean;
};

const axiosMockSwager = axios.create({
  baseURL: "http://2.56.213.92:5001/",
});

export type ApiTodo = {
  id: number | string;
  title: string;
  message: string;
  complete: boolean;
};

export interface AddTodosResponse {
  data: string;
}

interface GetTodosResponse {
  data: ApiTodo[];
}

export const addApiTodos = createAsyncThunk(
  "todos/addTodos",
  async (body: TTodo, { dispatch }) => {
    try {
      const { data } = await axiosMockSwager.post<AddTodosResponse>(
        "todos",
        body
      );
      dispatch(getTodos());
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const editApiTodos = createAsyncThunk(
  "todos/editTodos",
  async (body: ApiTodo, { dispatch }) => {
    const { id, ...others } = body;
    try {
      const { data } = await axiosMockSwager.put<AddTodosResponse>(
        `todos/${id}`,
        others
      );
      dispatch(getTodos());
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteApiTodos = createAsyncThunk(
  "todos/deleteTodos",
  async (id: string | number, { dispatch }) => {
    try {
      const { data } = await axiosMockSwager.delete<AddTodosResponse>(
        `todos/${id}`
      );
      dispatch(getTodos());
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getTodos = createAsyncThunk("todos/getTodos", async () => {
  try {
    const { data } = await axiosMockSwager.get<GetTodosResponse>("todos");
    return data;
  } catch (error) {
    console.log(error);
  }
});

interface ITodos {
  todos: TTodo[] | [];
  todosFromApi: ApiTodo[] | [];
  title: string;
  message: string;
  loading: boolean;
  search: string;
  filter: "all" | "active" | "complete";
}

const initialState: ITodos = {
  todos: [],
  todosFromApi: [],
  title: "",
  message: "",
  loading: false,
  search: "",
  filter: "all",
};

export const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    handleChange: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      state.title = payload;
    },

    handleMessageChange: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      state.message = payload;
    },
    handleSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    handleFilter: (
      state,
      action: PayloadAction<"all" | "active" | "complete">
    ) => {
      state.filter = action.payload;
    },

    addTodo: (state) => {
      let todo: TTodo = {
        id: new Date().getTime(),
        title: state.title,
        message: state.message,
        complete: false,
      };

      state.todos.push(todo as never);
    },

    deleteTodo: (state, action: PayloadAction<string | number>) => {
      state.todos = state.todos.filter(
        (todo: TTodo) => todo.id !== action.payload
      );
    },
    editTodo: (
      state,
      action: PayloadAction<{
        key1: string | number;
        key2: string;
      }>
    ) => {
      state.todos = state.todos.map((todo: TTodo) => {
        if (todo.id === action.payload.key1) {
          todo.title = action.payload.key2;
        }
        return todo;
      });
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      getTodos.pending,
      (state: ITodos, action: PayloadAction<string | number>) => {
        state.loading = true;
      }
    );
    builder.addCase(
      getTodos.fulfilled,
      (state: ITodos, action: PayloadAction<ApiTodo[]>) => {
        state.loading = false;
        state.todosFromApi = action.payload;
      }
    );
    builder.addCase(
      getTodos.rejected,
      (state: any, action: PayloadAction<string | number>) => {
        state.loading = false;
      }
    );

    builder.addCase(
      addApiTodos.pending,
      (state: ITodos, action: PayloadAction<string | number>) => {
        state.loading = true;
      }
    );
    builder.addCase(
      addApiTodos.fulfilled,
      (state: ITodos, action: PayloadAction<ApiTodo>) => {
        state.loading = false;
        state.title = "";
        state.message = "";
      }
    );
    builder.addCase(
      addApiTodos.rejected,
      (state: any, action: PayloadAction<string | number>) => {
        state.loading = false;
      }
    );

    builder.addCase(
      editApiTodos.pending,
      (state: ITodos, action: PayloadAction<string | number>) => {
        state.loading = true;
      }
    );
    builder.addCase(
      editApiTodos.fulfilled,
      (state: ITodos, action: PayloadAction<ApiTodo>) => {
        state.loading = false;
        state.title = "";
        state.message = "";
      }
    );
    builder.addCase(
      editApiTodos.rejected,
      (state: any, action: PayloadAction<string | number>) => {
        state.loading = false;
      }
    );

    builder.addCase(
      deleteApiTodos.pending,
      (state: ITodos, action: PayloadAction<string | number>) => {
        state.loading = true;
      }
    );
    builder.addCase(
      deleteApiTodos.fulfilled,
      (state: ITodos, action: PayloadAction<ApiTodo>) => {
        state.loading = false;
        state.title = "";
        state.message = "";
      }
    );
    builder.addCase(
      deleteApiTodos.rejected,
      (state: any, action: PayloadAction<string | number>) => {
        state.loading = false;
      }
    );
  },
});

export const {
  handleChange,
  handleMessageChange,
  addTodo,
  deleteTodo,
  editTodo,
  handleSearch,
  handleFilter,
} = slice.actions;

export default slice.reducer;
