import { VNode, svg } from '@cycle/dom';
import { Bodies, Body } from 'matter-js';
import xs, { Stream } from 'xstream';

import { MatterDiff } from './driver';
import { Sources, Sinks } from './interfaces';

type TimeStamp = Number;

export function App(sources: Sources): Sinks {
  const {
    DOM,
    Matter,
    Time
  } = sources;

  const click$: Stream<Event> = DOM
    .events('click');

  const initBodies$: Stream<MatterDiff> = xs
    .of((
      [
        Bodies.rectangle(1000, 1000, 2000, 10, {
          label: 'ground',
          isStatic: true
        })
      ]
    ));

  const clickBodies$: Stream<MatterDiff> = click$
    .map(() => (
      [
        Bodies.rectangle(1000, 25, 50, 50, {
          label: 'box',
          restitution: 0.9
        })
      ]
    ));

  const matter$: Stream<MatterDiff> = xs
    .merge(
      initBodies$,
      clickBodies$
    );

  const bodiesDOM$: Stream<VNode[]> = Matter
    .map(world => (
      world.bodies.map(body => {
        const attrs = {
          fill: 'transparent',
          points: body.vertices
            .map(vertex => vertex.x + ',' + vertex.y)
            .join(' '),
          stroke: '#000'
        };
        return svg.polygon({ attrs });
      })
    ))
    .startWith([]);

  const vnode$: Stream<VNode> = bodiesDOM$
    .map(bodies => {
      const attrs = {
        viewBox: '0 0 2000 1125'
      };
      return svg({ attrs }, bodies);
    });

  return {
    DOM: vnode$,
    Matter: matter$
  };
}
