import { ChildProcess, spawn } from 'child_process';
import { resolve } from 'path';
import { Compiler } from 'webpack';

// types
import { ICompilationHookFunction, IOptions, ITargetType } from './types';

export default class WebExtPlugin {
  private readonly browserConsole: boolean;
  private readonly devtools: boolean;
  private readonly persistState: boolean;
  private readonly pluginName: string = 'WebExtPlugin';
  private readonly startUrls: string[];
  private readonly target: ITargetType;
  private webExtRunProcess: ChildProcess | null;

  constructor(options?: IOptions) {
    this.browserConsole = options?.browserConsole || false;
    this.devtools = options?.devtools || false;
    this.persistState = options?.persistState || false;
    this.startUrls = options?.startUrls || [
      'http://info.cern.ch/hypertext/WWW/TheProject.html',
    ];
    this.target = options?.target || 'firefox';
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
    let binaryFlag: string = `--firefox-binary=${resolve(
      process.cwd(),
      '.firefox',
      'firefox'
    )}`;
    let profileFlag: string = `--firefox-profile=${resolve(
      process.cwd(),
      '.firefox_profile'
    )}`;
    let runCommand: string[] = [
      'run',
      `--target=chromium`,
      '--no-config-discovery', // ignore the config file
      `--source-dir=${sourceDir}`,
      ...this.startUrls.map((value) => `--start-url=${value}`),
    ];

    switch (this.target) {
      case 'chrome':
        binaryFlag = `--chromium-binary=${resolve(
          process.cwd(),
          '.chrome',
          'chrome'
        )}`;
        profileFlag = `--chromium-profile=${resolve(
          process.cwd(),
          '.chrome_profile'
        )}`;
        break;
      case 'firefox':
      default:
        break;
    }

    runCommand = [...runCommand, binaryFlag, profileFlag];

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
