import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { timeDriver } from '@cycle/time';

import { makeMatterDriver } from './driver';

import { App } from './app';

const drivers = {
  DOM: makeDOMDriver('#root'),
  Matter: makeMatterDriver(),
  Time: timeDriver
};

run(App, drivers);
