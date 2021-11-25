import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// import isBrowser from 'is-in-browser';
// if (isBrowser) { import ('react-datetime/css/react-datetime.css') };
// if (isBrowser) { import ('./styles.css') };

// import 'react-datetime/css/react-datetime.css';
import './styles.css';
import Page from '../src/Page.jsx';
import store from '../src/store.js';

/* eslint-disable no-underscore-dangle */
store.initialData = window.__INITIAL_DATA__;
store.userData = window.__USER_DATA__;

const element = (
  <Router>
    <Page />
  </Router>
);

ReactDOM.hydrate(element, document.getElementById('contents'));

if (module.hot) {
  module.hot.accept();
}

// import React from 'react';
// import './styles.css';
// import { HashRouter as Router } from 'react-router-dom';
// import Page from '../src/Page.jsx';
// // import Page from './Page.jsx';

// // const element = <Container />;

// const element = (
//   <Router>
//     <Page />
//   </Router>
// );

// ReactDOM.render(element, document.getElementById('contents'));
