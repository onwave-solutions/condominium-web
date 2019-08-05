import React, { ComponentType } from "react";
import { Provider as ReduxProvider } from "react-redux";
import LocaleProvider from "antd/lib/locale-provider";
import { ThemeProvider } from "styled-components";
import locale from "antd/lib/locale-provider/es_ES";
import { render } from "react-dom";

import moment from "moment";
import "moment/locale/es-do";

import theme from "./shared-ui/settings/themes";

import configureStore from "./shared-ui/store";
import { ReduxStoreProvider } from "./shared-ui/store/context";

import * as serviceWorker from "./serviceWorker";
import App from "./app";

const { store } = configureStore();

moment.locale("es-do");

function renderApp(AppComponent: ComponentType<any>): void {
  render(
    <ReduxProvider store={store}>
      <ReduxStoreProvider>
        <LocaleProvider locale={locale}>
          <ThemeProvider theme={theme}>
            <AppComponent />
          </ThemeProvider>
        </LocaleProvider>
      </ReduxStoreProvider>
    </ReduxProvider>,
    document.getElementById("root")
  );
}

renderApp(App);

declare const module: any;

if (module.hot) {
  module.hot.accept("./app", () => {
    const NextApp = require("./app").default;
    renderApp(NextApp);
  });
}

serviceWorker.unregister();
