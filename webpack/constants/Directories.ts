import { resolve } from 'path';

export const CHROME_BUILD_PATH: string = resolve(
  process.cwd(),
  '.chrome_build'
);
export const DAPP_EXAMPLE_BUILD_PATH: string = resolve(
  process.cwd(),
  '.dapp_example_build'
);
export const DAPP_EXAMPLE_SRC_PATH: string = resolve(
  process.cwd(),
  'dapp-example'
);
export const EDGE_BUILD_PATH: string = resolve(process.cwd(), '.edge_build');
export const FIREFOX_BUILD_PATH: string = resolve(
  process.cwd(),
  '.firefox_build'
);
export const SRC_PATH: string = resolve(process.cwd(), 'src');
