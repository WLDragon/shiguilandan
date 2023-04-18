import { Container } from 'pixi.js';
import { initRouter } from '../utils/router';

import Home from '../component/Home';
import Record from '../component/Record';
import World from '../component/World';
import Battle from '../component/Battle';
import Roots from '../component/Roots';

export function configRouter(container: Container) {
  initRouter(container, {
    Home,
    Record,
    World,
    Battle,
    Roots
  })
}