import 'mockzilla-webextension';
import { TextDecoder, TextEncoder } from 'util';

import { version } from '../package.json';
import { browser_specific_settings } from '../src/manifest.json';

Object.defineProperty(global, '__AGORA_WALLET_EXTENSION_ID__', {
  value: browser_specific_settings.gecko.id,
});
Object.defineProperty(global, '__ENV__', {
  value: 'test',
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
