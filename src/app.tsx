import React from "react";
import { ToastContainer } from "react-toastify";
import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import Shell from "./components/pages/shell";
import Login from "./components/pages/login";
import { useReduxState } from "./shared-ui/store/hooks";
import { select } from "./shared-ui/store/selectors";
import { appSelector } from "./shared-ui/store/selectors/app";
import "antd/dist/antd.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

const history = createBrowserHistory({});

function proxy(token: string) {
  if (!token) {
    return Login;
  }
  return Shell;
}

const appState = select(appSelector);

export default function App() {
  const token = useReduxState(appState("token"));
  return (
    <>
      <Router history={history}>
        <Switch>
          <Route path="/" component={proxy(token)} />
        </Switch>
      </Router>
      <ToastContainer
        style={{ fontSize: "1.2rem" }}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        draggable={true}
        pauseOnHover={true}
      />
    </>
  );
}
