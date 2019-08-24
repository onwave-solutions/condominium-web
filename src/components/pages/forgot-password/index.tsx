import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../atoms/input";
import Button from "../../atoms/button";
import Icon from "../../atoms/icon";
import Form from "../../atoms/form";
import SignInStyleWrapper from "../login/style";

import { useReduxAction, useReduxState } from "../../../shared-ui/store/hooks";
import { appSelector } from "../../../shared-ui/store/selectors/app";
import { select } from "../../../shared-ui/store/selectors";
import { User } from "../../../shared-ui/models/user";
import {
  onSendChangePasswordCode,
  onSendChangePassword
} from "../../../shared-ui/store/actions/app";

const appState = select(appSelector);

const ForgotPassword: React.FC<any> = (props: any) => {
  const { getFieldDecorator } = props.form;
  const [user, setUser] = useState<User>({});
  const loading = useReduxState(appState("loading"));

  const forgotPassword = useReduxAction(onSendChangePasswordCode);
  const changePassword = useReduxAction(onSendChangePassword);

  const onSubmit = (e: any) => {
    e.preventDefault();
    props.form.validateFields(async (err: any, values: any) => {
      if (err) {
        console.log(err);
        return;
      }
      if (user.status === "F") {
        changePassword(
          {
            username: values.username,
            code: values.code,
            password: values.password,
            code2: values.code2,
          },
          () => {
            props.history.replace("/dashboard");
          }
        );
        return;
      }
      await forgotPassword(
        {
          username: values.username
        },
        () => {
          setUser({
            ...user,
            status: "F"
          });
        }
      );
    });
  };

  return (
    <SignInStyleWrapper className="isoSignInPage">
      <div className="isoLoginContentWrapper">
        <div className="isoLoginContent">
          <div className="isoLogoWrapper">
            <Link to="/">DOMINET</Link>
          </div>
          <Form onSubmit={onSubmit} className="isoSignInForm">
            <Form.Item className="isoInputWrapper">
              {getFieldDecorator("username", {
                rules: [
                  { required: true, message: "Nombre de Usuario Requerido!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon
                      type="user"
                      style={{ marginTop: 10, color: "rgba(0,0,0,.25)" }}
                    />
                  }
                  disabled={["F"].includes(user.status!)}
                  size="large"
                  placeholder="Email"
                />
              )}
            </Form.Item>
            {user.status === "F" && (
              <>
                <Form.Item
                  className="isoInputWrapper"
                  label="Código de autorización"
                >
                  {getFieldDecorator("code", {
                    rules: [
                      {
                        required: true,
                        message: "Código de authorización requerido"
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ marginTop: 10, color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      size="large"
                      placeholder="Código"
                    />
                  )}
                </Form.Item>
                <Form.Item className="isoInputWrapper" label="Nueva Contraseña">
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Nueva Contraseña Requerida"
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ marginTop: 10, color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      size="large"
                      type="password"
                      placeholder="Nueva Contraseña"
                    />
                  )}
                </Form.Item>
                <Form.Item
                  className="isoInputWrapper"
                  label="Repetir Contraseña"
                >
                  {getFieldDecorator("code2", {
                    rules: [
                      {
                        required: true,
                        message: "Nueva Contraseña Requerida"
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ marginTop: 10, color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      size="large"
                      type="password"
                      placeholder="Repetir Contraseña"
                    />
                  )}
                </Form.Item>
              </>
            )}
            <Form.Item className="isoInputWrapper isoLeftRightComponent">
              <Button type="primary" htmlType="submit" loading={loading}>
                {user.status === "F" ? "Cambiar Contraseña" : "Enviar"}
              </Button>
            </Form.Item>
            <Link to="/" className="isoForgotPass">
              Volver Atras
            </Link>
          </Form>
        </div>
      </div>
    </SignInStyleWrapper>
  );
};

export default Form.create({ name: "forgot_Form" })(ForgotPassword);
