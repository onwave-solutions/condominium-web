import React, { ComponentType } from 'react';
import LocaleProvider from 'antd/lib/locale-provider';
import { ThemeProvider } from 'styled-components';
import locale from 'antd/lib/locale-provider/es_ES';
import { render } from 'react-dom';

import theme from './shared-ui/settings/themes';

import * as serviceWorker from './serviceWorker';
import App from './app';

function renderApp(AppComponent: ComponentType<any>): void {
  render(
    <LocaleProvider locale={locale}>
      <ThemeProvider theme={theme}>
        <AppComponent />
      </ThemeProvider>
    </LocaleProvider>,
    document.getElementById('root')
  );
}

renderApp(App);

declare const module: any;

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default;
    renderApp(NextApp);
  });
}

serviceWorker.unregister();
