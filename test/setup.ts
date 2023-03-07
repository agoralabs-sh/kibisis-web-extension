import 'mockzilla-webextension';
import { webcrypto } from 'crypto';
import { TextEncoder, TextDecoder } from 'util';

import { version } from '../package.json';

Object.defineProperty(global, '__ENV__', {
  value: 'test',
});
Object.defineProperty(global, '__VERSION__', {
  value: `${version}-test`,
});

// polyfill
Object.defineProperty(global.crypto, 'subtle', {
  value: webcrypto.subtle,
});
Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
});
Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder,
});

jest.setTimeout(60000); // in milliseconds
