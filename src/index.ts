import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';

import { makeMatterDriver } from './driver';

import { App } from './app';

const drivers = {
  DOM: makeDOMDriver('#root'),
  Matter: makeMatterDriver()
};

run(App, drivers);
