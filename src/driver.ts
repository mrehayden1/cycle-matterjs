import { Driver } from '@cycle/run';
import { Bodies, Body, Engine, Render, World } from 'matter-js';
import xs, { Listener, Stream } from 'xstream';

export type TimeDiff = number;
export type MatterDiff = Body[];
export type MatterSource = Stream<World>;

export type MatterDriverOptions = {
  // Whether to Synchronise the simulation with requestAnimationFrame.
  // This can cause glitchy simulations when there are significant delays inbetween frames (lag).
  sync: boolean
}

export function makeMatterDriver(options: MatterDriverOptions): Driver<Stream<MatterDiff>, MatterSource> {

  const engine: Engine = Engine.create();

  let buffer: MatterDiff = [];

  let requestId: number;

  let timestamp: number;

  function update(listener: Listener<World>, t: number) {
    buffer.forEach(body => {
      World.add(engine.world, body)
    });
    buffer = [];

    if (options.sync) {
      const delta = t - timestamp;
      timestamp = t;
      Engine.update(engine, delta);
    }
    else {
      Engine.update(engine, 16.67);
    }

    listener.next(engine.world);

    requestId = requestAnimationFrame(t => update(listener, t));
  }

  return function(sink$: Stream<MatterDiff>, name?: string): MatterSource {
    sink$.subscribe({
      complete: () => {},
      error: () => {},
      next: (bodies: MatterDiff) => {
        buffer = buffer.concat(bodies);
      }
    });

    return xs.create({
      start: listener => {
        timestamp = performance.now();
        requestId = requestAnimationFrame(t => update(listener, t));
      },
      stop: () => {
        cancelAnimationFrame(requestId);
      }
    });;
  }
}
