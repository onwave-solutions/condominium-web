import React from "react";
import { ToastContainer } from "react-toastify";
import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import Shell from "./components/pages/shell";
import "antd/dist/antd.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

const history = createBrowserHistory({});

export default function App() {
  return (
    <>
      <Router history={history}>
        <Switch>
          <Route path="/" component={Shell} />
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
