import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { Compiler } from 'webpack';

// types
import { ICompilationHookFunction } from '../../types';

export default class ManifestBuilderPlugin {
  private readonly manifestPaths: string[];
  private readonly pluginName: string = 'ManifestBuilderPlugin';

  constructor(...manifestPaths: string[]) {
    this.manifestPaths = manifestPaths || [];
  }

  private afterEmit(compiler: Compiler): ICompilationHookFunction {
    return async (): Promise<void> => await this.run(compiler.outputPath);
  }

  private async run(outputPath: string): Promise<void> {
    const manifest: Record<string, unknown> = this.manifestPaths.reduce(
      (acc, value) => {
        const buffer: Buffer = readFileSync(value);

        return {
          ...acc,
          ...JSON.parse(buffer.toString()),
        };
      },
      {}
    );

    await writeFile(`${outputPath}/manifest.json`, JSON.stringify(manifest));
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.afterEmit.tapPromise(
      this.pluginName,
      this.afterEmit(compiler)
    );
  }
}
