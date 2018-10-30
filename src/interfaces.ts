import xs from 'xstream';
import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';

import { MatterDiff, MatterSource } from './driver';

export type Sources = {
  DOM: DOMSource,
  Matter: MatterSource
};

export type Sinks = {
  DOM: Stream<VNode>,
  Matter: Stream<MatterDiff[]>
};
