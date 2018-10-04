import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';

import { Component } from './interfaces';
import { makeMatterDriver } from './driver';

import { App } from './app';

const main : Component = App;

const drivers = {
  Matter: makeMatterDriver(document.getElementsByTagName('body')[0])
};

run(main, drivers);
