import { Stats } from 'webpack';

type IDoneHookFunction = (stats: Stats) => Promise<void>;

export default IDoneHookFunction;
