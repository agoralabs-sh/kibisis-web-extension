import { resolve } from 'path';

export const CHROME_BUILD_PATH: string = resolve(
  process.cwd(),
  '.chrome_build'
);
export const DAPP_BUILD_PATH: string = resolve(process.cwd(), '.dapp');
export const DAPP_SRC_PATH: string = resolve(process.cwd(), 'dapp');
export const EDGE_BUILD_PATH: string = resolve(process.cwd(), '.edge_build');
export const FIREFOX_BUILD_PATH: string = resolve(
  process.cwd(),
  '.firefox_build'
);
export const SRC_PATH: string = resolve(process.cwd(), 'src');
