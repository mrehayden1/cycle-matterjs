import { Driver } from '@cycle/run';
import { Bodies, Body, Composite, Engine, Render, World } from 'matter-js';
import xs, { Listener, Stream } from 'xstream';

export type MatterDiff = {
  type: 'add',
  body: Body | Composite
} | {
  type: 'pause'
} | {
  type: 'remove',
  label: string
} | {
  type: 'resume'
};

export type MatterSource = Stream<World>;

export function makeMatterDriver(): Driver<Stream<MatterDiff[]>, MatterSource> {

  const engine: Engine = Engine.create();
  const world: World = engine.world;

  let buffer: MatterDiff[] = [];
  let requestId: number;
  let running: boolean = true;
  let timestamp: number;

  function update(listener: Listener<World>, t: number) {
    buffer.forEach(diff => {
      if (diff.type === 'add') {
        World.add(world, diff.body);
      }
      if (diff.type === 'pause') {
        running = false;
      }
      if (diff.type === 'remove') {
        const remove: Body[] = [];
        engine.world.bodies.forEach(body => {
          if (body.label === diff.label) {
            remove.push(body);
          }
        });
        remove.forEach(body => {
          World.remove(world, body);
        });
      }
      if (diff.type === 'resume') {
        running = true;
      }
    });
    buffer = [];

    if (running) {
      Engine.update(engine, 16.67);
    }

    listener.next(engine.world);

    requestId = requestAnimationFrame(t => update(listener, t));
  }

  return function(sink$: Stream<MatterDiff[]>, name?: string): MatterSource {
    sink$.subscribe({
      complete: () => {},
      error: () => {},
      next: (diffs: MatterDiff[]) => {
        buffer = buffer.concat(diffs);
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
