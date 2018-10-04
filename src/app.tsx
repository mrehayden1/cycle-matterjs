import { Bodies } from 'matter-js';
import xs from 'xstream';

import { Sources, Sinks } from './interfaces';

export function App(sources: Sources): Sinks {
  const matter$ = xs.of(Bodies.rectangle(400, 200, 80, 80));

  return {
    Matter: matter$
  };
}
