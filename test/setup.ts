import 'mockzilla-webextension';
import { TextDecoder, TextEncoder } from 'util';
import { v4 as uuid } from 'uuid';

// config
import { name, version } from '../package.json';

Object.defineProperty(global, '__APP_TITLE__', {
  value: `${name}-test`,
});
Object.defineProperty(global, '__ENV__', {
  value: 'test',
});
Object.defineProperty(global, '__VERSION__', {
  value: `${version}-test`,
});
Object.defineProperty(global, '__WALLET_CONNECT_PROJECT_ID__', {
  value: uuid(),
});
Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder,
});
Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
});

jest.setTimeout(60000); // in milliseconds
