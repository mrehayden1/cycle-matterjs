import { VNode, button, div, svg } from '@cycle/dom';
import { Bodies } from 'matter-js';
import xs, { Stream } from 'xstream';

import { MatterDiff } from './driver';
import { Sources, Sinks } from './interfaces';

type TimeStamp = Number;

export function App(sources: Sources): Sinks {
  const {
    DOM,
    Matter
  } = sources;

  const click$: Stream<Event> = DOM
    .select('.canvas')
    .events('click');

  const pause$: Stream<Event> = DOM
    .select('.pause')
    .events('click');

  const resume$: Stream<Event> = DOM
    .select('.resume')
    .events('click');

  const clear$: Stream<Event> = DOM
    .select('.clear')
    .events('click');

  const initBodies$: Stream<MatterDiff[]> = xs
    .of((
      [{
        type: 'add',
        body: Bodies.rectangle(1000, 1000, 2000, 10, {
          label: 'ground',
          isStatic: true
        })
      }] as MatterDiff[]
    ));

  const clickBodies$: Stream<MatterDiff[]> = click$
    .map(() => (
      [{
        type: 'add',
        body: Bodies.rectangle(1000, 25, 50, 50, {
          label: 'box',
          restitution: 0.9
        })
      }] as MatterDiff[]
    ));

  const matter$: Stream<MatterDiff[]> = xs
    .merge(
      initBodies$,
      clickBodies$,
      pause$.mapTo([{ type: 'pause' }] as MatterDiff[]),
      resume$.mapTo([{ type: 'resume' }] as MatterDiff[]),
      clear$.mapTo([{ type: 'remove', label: 'box' }] as MatterDiff[])
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
      return div([
        button('.pause', 'Pause'),
        button('.resume', 'Resume'),
        button('.clear', 'Clear'),
        svg({
          attrs: {
            class: 'canvas',
            viewBox: '0 0 2000 1125'
          }
        }, bodies)
      ]);
    });

  return {
    DOM: vnode$,
    Matter: matter$
  };
}
