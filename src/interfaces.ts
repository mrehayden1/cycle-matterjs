import xs from 'xstream';
import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { TimeSource } from '@cycle/time';

import { MatterDiff, MatterSource } from './driver';

export type Sources = {
  DOM: DOMSource,
  Matter: MatterSource,
  Time: TimeSource
};

export type Sinks = {
  DOM: Stream<VNode>,
  Matter: Stream<MatterDiff>
};
