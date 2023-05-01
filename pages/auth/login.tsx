import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reactRedux";
import { Button, Checkbox, Form, Input } from "antd";
import { registerUser, loginUser, LoginObg } from "../../reducers/auth";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onLoginSubmit = async (values: any) => {
    try {
      await dispatch(
        loginUser({
          ...values,
        })
      );
      router.push("/users");
    } catch (error) {}
  };

  const onLoginFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="mb-4 flex flex-col space-y-4 w-[70%] mx-auto">
      <h2 className="text-xl">Login</h2>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onLoginSubmit}
        onFinishFailed={onLoginFailed}
        autoComplete="off"
      >
        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, message: "Please input your E-mail!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button htmlType="submit">Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
