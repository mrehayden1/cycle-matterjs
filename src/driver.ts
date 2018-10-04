import { Driver } from '@cycle/run';
import { Bodies, Body, Engine, Render, World } from 'matter-js';
import { Stream } from 'xstream';

export type MatterDiff = Body;

export function makeMatterDriver(element: HTMLElement): Driver<Stream<MatterDiff>, void> {

  const engine = Engine.create();

  const render = Render.create({
    element: element,
    engine: engine
  });

  Engine.run(engine);
  Render.run(render);

  return function(sink$: Stream<MatterDiff>, name?: string): void {

    sink$.subscribe({
      complete: () => {},
      error: () => {},
      next: (diff: MatterDiff) => {
        World.add(engine.world, diff);
      }
    });

  }
}
