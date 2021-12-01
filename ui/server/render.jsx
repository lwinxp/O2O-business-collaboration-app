import React, { Profiler } from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';

import Page from '../src/Page.jsx';
import template from './template.js';
import store from '../src/store.js';
import routes from '../src/routes.js';

// import About from './About.js';

async function render(req, res) {
  const activeRoute = routes.find(
    route => matchPath(req.path, route),
  );

  let initialData;
  if (activeRoute && activeRoute.component.fetchData) {
    const match = matchPath(req.path, activeRoute);
    const index = req.url.indexOf('?');
    const search = index !== -1 ? req.url.substr(index) : null;
    initialData = await activeRoute.component
      .fetchData(match, search, req.headers.cookie);
  }

  const userData = await Page.fetchData(req.headers.cookie);

  store.initialData = initialData;
  store.userData = userData;

  // const callBack = (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
  //   console.log(`[React Profiler - render.jsx] ${id}'s ${phase} phase:`);
  //   console.log(`[React Profiler - render.jsx] Actual Duration: ${actualDuration}`);
  //   console.log(`[React Profiler - render.jsx] Base Duration: ${baseDuration}`);
  //   console.log(`[React Profiler - render.jsx] Start time: ${startTime}`);
  //   console.log(`[React Profiler - render.jsx] Commit time: ${commitTime}`);
  //   console.log(`[React Profiler - render.jsx] Interactions: ${interactions}`);
  // };

  const context = {};
  const element = (
    <StaticRouter location={req.url} context={context}>
      {/* <Profiler id="render Page" onRender={callBack}> */}
      <Page />
      {/* </Profiler> */}
    </StaticRouter>
  );
  const body = ReactDOMServer.renderToString(element);
  // const body = ReactDOMServer.renderToString(<About />);
  // ReactDOMServer.renderToString() is for SSR

  if (context.url) {
    res.redirect(301, context.url);
  } else {
    res.send(template(body, initialData, userData));
    // template.js is meant to be similar to index.html to accept HTML tags and return HTML
  }
}

export default render;
