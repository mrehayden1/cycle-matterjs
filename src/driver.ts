import { Driver } from '@cycle/run';
import { Bodies, Body, Engine, Render, World } from 'matter-js';
import xs, { Listener, Stream } from 'xstream';

export type TimeDiff = number;
export type MatterDiff = Body[];
export type MatterSource = Stream<World>;

export function makeMatterDriver(): Driver<Stream<MatterDiff>, MatterSource> {

  const engine: Engine = Engine.create();

  let buffer: MatterDiff = [];

  let requestId: number;

  let timestamp: number;

  function update(listener: Listener<World>, t: number) {
    buffer.forEach(body => {
      World.add(engine.world, body)
    });
    buffer = [];

    const delta = t - timestamp;
    timestamp = t;
    Engine.update(engine, delta);

    listener.next(engine.world);

    requestId = requestAnimationFrame(t => update(listener, t));
  }

  return function(sink$: Stream<MatterDiff>, name?: string): MatterSource {
    const source$: Stream<World> = xs.create({
      start: listener => {
        timestamp = performance.now();
        requestId = requestAnimationFrame(t => update(listener, t));
      },
      stop: () => {
        cancelAnimationFrame(requestId);
      }
    });

    // TODO Handle complete and error?
    sink$.subscribe({
      complete: () => {},
      error: () => {},
      next: (bodies: MatterDiff) => {
        buffer = buffer.concat(bodies);
      }
    });

    return source$;
  }
}
