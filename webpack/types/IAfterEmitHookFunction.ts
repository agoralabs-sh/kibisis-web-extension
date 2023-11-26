import { Compilation } from 'webpack';

type IAfterEmitHookFunction = (compilation: Compilation) => Promise<void>;

export default IAfterEmitHookFunction;
