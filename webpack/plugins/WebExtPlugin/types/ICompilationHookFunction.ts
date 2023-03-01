import { Compilation } from 'webpack';

type ICompilationHookFunction = (compilation: Compilation) => Promise<void>;

export default ICompilationHookFunction;
