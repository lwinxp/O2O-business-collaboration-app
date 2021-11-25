import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from './routes.js';

export default function Contents() {
  return (
    <Switch>
      <Redirect exact from="/" to="/about" />
      {routes.map(attrs => <Route exact {...attrs} key={attrs.path} />)}
    </Switch>
  );
}
