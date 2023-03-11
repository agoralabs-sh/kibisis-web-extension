import 'mockzilla-webextension';

import { version } from '../package.json';

Object.defineProperty(global, '__ENV__', {
  value: 'test',
});
Object.defineProperty(global, '__VERSION__', {
  value: `${version}-test`,
});

jest.setTimeout(60000); // in milliseconds
