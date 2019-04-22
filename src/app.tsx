import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Shell from './components/pages/shell';
import 'antd/dist/antd.css';
import './styles.css';

const history = createBrowserHistory({});

export default function App() {
  return (
    <>
      <Router history={history}>
        <Switch>
          <Route path='*' component={Shell} />
        </Switch>
      </Router>
    </>
  );
}
