import 'babel-polyfill';
import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// import isBrowser from 'is-in-browser';
// if (isBrowser) { import ('react-datetime/css/react-datetime.css') };
// if (isBrowser) { import ('./styles.css') };

// import 'react-datetime/css/react-datetime.css';
import './styles.css';
import Page from '../src/Page.jsx';
import store from '../src/store.js';

const t0 = performance.now();

/* eslint-disable no-underscore-dangle */
store.initialData = window.__INITIAL_DATA__;
store.userData = window.__USER_DATA__;

const callBack = (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
  console.log(`[React Profiler] ${id}'s ${phase} phase:`);
  console.log(`[React Profiler] Actual Duration: ${actualDuration}`);
  console.log(`[React Profiler] Base Duration: ${baseDuration}`);
  console.log(`[React Profiler] Start time: ${startTime}`);
  console.log(`[React Profiler] Commit time: ${commitTime}`);
  console.log(`[React Profiler] Interactions: ${interactions}`);
};

const element = (
  <Profiler id="Page" onRender={callBack}>

    <Router>
      {/* https://medium.com/@dave_lunny/how-to-use-reacts-experimental-new-profiler-feature-c340674e5d0e */}
      <Page />
    </Router>
  </Profiler>

);

// performance.mark('beginHydrate');

// const h0 = performance.now();
ReactDOM.hydrate(element, document.getElementById('contents'));
// ReactDOM.render(element, document.getElementById('contents'));

// const h1 = performance.now();
// console.log(`[JS Performance] App.jsx hydrate took ${h1 - h0} milliseconds.`);

// performance.mark('endHydrate');

// window.performance.measure('measureHydate', 'beginHydrate', 'endHydrate');
// console.log(`App.jsx measureHydrate took ${measureHydrate} milliseconds.`);

// console.log('[JS Performance] App.jsx beginHydrate:', performance.getEntriesByName('beginHydrate'));
// console.log('[JS Performance] App.jsx endHydrate:', performance.getEntriesByName('endHydrate'));
// console.log('[JS Performance] App.jsx measureHydrate:', performance.getEntriesByName('measureHydrate'));


if (module.hot) {
  module.hot.accept();
}

const t1 = performance.now();

console.log(`[JS Performance] performance.now() ${t1 - t0} milliseconds.`);

const pge = performance.getEntries();
console.log('[JS Performance] performance.getEntries():', pge);

// console.log('[JS Performance] App.jsx performance.toJSON():', performance.toJSON());

// const pgeTypePaint = performance.getEntriesByType('paint');
// console.log('[JS Performance] App.jsx pgeTypePaint:', pgeTypePaint);

// const pgeTypeFrame = performance.getEntriesByType('frame');
// console.log('[JS Performance] App.jsx pgeTypeFrame:', pgeTypeFrame);

// const pgeTypeResource = performance.getEntriesByType('resource');
// console.log('[JS Performance] App.jsx pgeTypeResource:', pgeTypeResource);

// const pgeTypeMark = performance.getEntriesByType('mark');
// console.log('[JS Performance] App.jsx pgeTypeMark:', pgeTypeMark);

// const pgeTypeLongTask = performance.getEntriesByType('longtask');
// console.log('[JS Performance] App.jsx pgeTypeLongTask:', pgeTypeLongTask);


// const pgeName = performance.getEntriesByName('localhost:8000')[0];
// console.log('[JS Performance] App.jsx pgeName:', pgeName);

// const navigationEntry = performance.getEntriesByType('navigation')[0];
// console.log('[JS Performance] App.jsx navigationEntry:', navigationEntry);


// const pgeTypeResourceImg = performance.getEntriesByType('resource').filter(resource => resource.initiatorType === 'img');
// console.log('[JS Performance] App.jsx pgeTypeResourceImg:', pgeTypeResourceImg);
