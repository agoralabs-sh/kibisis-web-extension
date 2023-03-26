import { ChildProcess, spawn } from 'child_process';
import { resolve } from 'path';
import { Compiler } from 'webpack';

// Types
import { ICompilationHookFunction, IOptions } from './types';

export default class WebExtPlugin {
  private readonly browserConsole: boolean;
  private readonly devtools: boolean;
  private readonly persistState: boolean;
  private readonly pluginName: string = 'WebExtPlugin';
  private readonly startUrls: string[];
  private webExtRunProcess: ChildProcess | null;

  constructor(options?: IOptions) {
    this.browserConsole = options?.browserConsole || false;
    this.devtools = options?.devtools || false;
    this.persistState = options?.persistState || false;
    this.startUrls = options?.startUrls || [
      'http://info.cern.ch/hypertext/WWW/TheProject.html',
    ];
    this.webExtRunProcess = null;
  }

  private afterEmit(compiler: Compiler): ICompilationHookFunction {
    return async (): Promise<void> => {
      if (!this.webExtRunProcess) {
        this.run(compiler.outputPath);
      }
    };
  }

  private run(sourceDir: string): void {
    let runCommand: string[] = [
      'run',
      '--no-config-discovery', // ignore the config file
      `--source-dir=${sourceDir}`,
      `--firefox=${resolve(process.cwd(), '.firefox', 'firefox')}`, // use the installed version from the npm prepare script
      ...this.startUrls.map((value) => `--start-url=${value}`),
    ];

    if (this.browserConsole) {
      runCommand = [...runCommand, '--browser-console'];
    }

    if (this.devtools) {
      runCommand = [...runCommand, '--devtools'];
    }

    if (this.persistState) {
      runCommand = [
        ...runCommand,
        '--keep-profile-changes',
        '--profile-create-if-missing',
        `--firefox-profile=${resolve(process.cwd(), '.firefox_profile')}`,
      ];
    }

    // start web-ext
    this.webExtRunProcess = spawn('web-ext', runCommand);
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.afterEmit.tapPromise(
      this.pluginName,
      this.afterEmit(compiler)
    );
  }
}
