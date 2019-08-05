import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../atoms/input";
import Button from "../../atoms/button";
import Icon from "../../atoms/icon";
import Form from "../../atoms/form";
import SignInStyleWrapper from "./style";
import {
  loginAction,
  validateCodeAction,
  restoreSessionAction,
  changePasswordAction
} from "../../../shared-ui/store/actions/app";
import { useReduxAction, useReduxState } from "../../../shared-ui/store/hooks";
import { appSelector } from "../../../shared-ui/store/selectors/app";
import { select } from "../../../shared-ui/store/selectors";

const appState = select(appSelector);
export function Login(props: any) {
  const user = useReduxState(appState("user"));
  const loading = useReduxState(appState("loading"));
  const { getFieldDecorator } = props.form;
  const onLogin = useReduxAction(loginAction);
  const validateCode = useReduxAction(validateCodeAction);
  const changePassword = useReduxAction(changePasswordAction);
  const restoreSession = useReduxAction(restoreSessionAction);
  const onSubmit = (e: any) => {
    e.preventDefault();
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        if (user.status === "C") {
          changePassword(
            {
              username: values.username,
              password: values.password,
              code: values.code
            },
            () => {
              props.history.replace("/dashboard");
            }
          );
        } else {
          onLogin(
            { username: values.username, password: values.password },
            () => {
              props.history.replace("/dashboard");
            }
          );
        }
      }
    });
  };
  useEffect(() => {
    restoreSession();
  }, []);
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
                  disabled={!["A", undefined].includes(user.status)}
                  size="large"
                  placeholder="Email"
                />
              )}
            </Form.Item>
            <Form.Item className="isoInputWrapper">
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "Contraseña Requerida!" }]
              })(
                <Input
                  prefix={
                    <Icon
                      type="lock"
                      style={{ marginTop: 10, color: "rgba(0,0,0,.25)" }}
                    />
                  }
                  size="large"
                  disabled={!["A", undefined].includes(user.status)}
                  type="password"
                  placeholder="Contraseña"
                />
              )}
            </Form.Item>
            {user.status === "C" && (
              <>
                <Form.Item className="isoInputWrapper" label="Nueva Contraseña">
                  {getFieldDecorator("code", {
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
              </>
            )}
            <Form.Item className="isoInputWrapper isoLeftRightComponent">
              <Button type="primary" htmlType="submit" loading={loading}>
                {user.status === "C" ? "Confirmar Usuario" : "Iniciar Sesión"}
              </Button>
            </Form.Item>
            <Link to="/forgotpassword" className="isoForgotPass">
              Olvidé mi contraseña
            </Link>
          </Form>
        </div>
      </div>
    </SignInStyleWrapper>
  );
}
export default Form.create({ name: "login_form" })(Login);
