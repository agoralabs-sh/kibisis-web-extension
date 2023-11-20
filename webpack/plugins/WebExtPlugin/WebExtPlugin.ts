import { ChildProcess, spawn } from 'child_process';
import { resolve } from 'path';
import { Compiler } from 'webpack';

// types
import { ICompilationHookFunction, ITargetType } from '../../types';
import { IOptions } from './types';

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
    let targetFlag: string = `--target=firefox-desktop`;
    let runCommand: string[] = [
      'run',
      `--chromium-profile=${resolve(process.cwd(), '.chrome_profile')}`,
      `--chromium-binary=${resolve(process.cwd(), '.chrome', 'chrome')}`,
      `--firefox=${resolve(process.cwd(), '.firefox', 'firefox')}`,
      `--firefox-profile=${resolve(process.cwd(), '.firefox_profile')}`,
      '--no-config-discovery', // ignore the config file at project root
      `--source-dir=${sourceDir}`,
      ...this.startUrls.map((value) => `--start-url=${value}`),
    ];

    switch (this.target) {
      case 'chrome':
        targetFlag = '--target=chromium';
        break;
      case 'firefox':
      default:
        break;
    }

    runCommand = [...runCommand, targetFlag];

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
