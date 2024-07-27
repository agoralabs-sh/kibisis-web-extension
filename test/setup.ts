import 'isomorphic-fetch';
import { TextDecoder, TextEncoder } from 'util';

// config
import { name, version } from '../package.json';

Object.defineProperty(global, '__APP_TITLE__', {
  value: `${name}-test`,
});
Object.defineProperty(global, '__ENV__', {
  value: 'test',
});
Object.defineProperty(global, '__TARGET__', {
  value: 'firefox-test',
});
Object.defineProperty(global, '__VERSION__', {
  value: `${version}-test`,
});
Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder,
});
Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
});

jest.setTimeout(60000); // in milliseconds
