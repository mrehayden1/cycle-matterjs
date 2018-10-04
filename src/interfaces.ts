import xs from 'xstream';
import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';

import { MatterDiff } from './driver';

export type Sources = {
};

export type Sinks = {
  Matter: Stream<MatterDiff>
};

export type Component = (s: Sources) => Sinks;
