import { existsSync, readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { Compiler, Stats } from 'webpack';

export default class ManifestBuilderPlugin {
  private readonly manifestPaths: string[];
  private readonly pluginName: string = 'ManifestBuilderPlugin';

  constructor(...manifestPaths: string[]) {
    this.manifestPaths = manifestPaths || [];
  }

  private async done(stats: Stats): Promise<void> {
    await this.run(stats.compilation.compiler.outputPath);
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

    // create directory if it doesn't exist
    if (!existsSync(outputPath)) {
      await mkdir(outputPath, { recursive: true });
    }

    await writeFile(`${outputPath}/manifest.json`, JSON.stringify(manifest));
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.done.tapPromise(this.pluginName, this.done.bind(this));
  }
}
