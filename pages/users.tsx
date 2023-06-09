import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/reactRedux";
import {
  getTodos,
  addApiTodos,
  editApiTodos,
  deleteApiTodos,
  ApiTodo,
} from "@/reducers/todos";
import { Table } from "antd";
import { getUsers, OwnUser } from "../reducers/auth";
import type { ColumnsType } from "antd/es/table";
import styles from "@/styles/Home.module.css";

export default function Users() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(({ todos }) => todos.todosFromApi);
  const users = useAppSelector(({ auth }) => auth.users);
  let [cnt, setCnt] = useState<number>(0);

  const columns: ColumnsType<OwnUser> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },

    {
      title: "Edit",
      render: (row) => {
        return (
          <button
            onClick={() => {}}
            className="px-3 py-1 bg-blue-600 text-white rounded-md"
          >
            Edit
          </button>
        );
      },
    },
    {
      title: "Delete",
      render: (row) => {
        return (
          <button
            onClick={() => {
              dispatch(deleteApiTodos(row.id));
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        );
      },
    },
  ];

  console.log(users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Table columns={columns} dataSource={users} />
      </main>
    </>
  );
}
