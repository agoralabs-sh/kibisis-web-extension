import { resolve } from 'path';

export const BUILD_PATH: string = resolve(process.cwd(), '.build');
export const DAPP_BUILD_PATH: string = resolve(process.cwd(), '.dapp');
export const DAPP_SRC_PATH: string = resolve(process.cwd(), 'dapp');
export const SRC_PATH: string = resolve(process.cwd(), 'src');
