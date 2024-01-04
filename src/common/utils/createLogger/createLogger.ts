/* eslint-disable @typescript-eslint/no-explicit-any */
// types
import { ILogger, ILogLevel } from '@common/types';

/**
 * Creates a logger that can set whether the logs appear based on the level
 * @param {ILogLevel} level - the base level of logging
 * @returns {ILogger} a logger that can be used to create logs based on the level
 */
export default function createLogger(level: ILogLevel): ILogger {
  const canLog: (allowedLevel: ILogLevel) => boolean = (
    allowedLevel
  ): boolean => {
    switch (level) {
      case 'error':
        return allowedLevel === 'error';
      case 'warn':
        return allowedLevel === 'error' || allowedLevel === 'warn';
      case 'info':
        return (
          allowedLevel === 'error' ||
          allowedLevel === 'warn' ||
          allowedLevel === 'info'
        );
      case 'debug':
        return true;
      default:
        return false;
    }
  };

  return {
    debug: (message?: any, ...optionalParams: any[]) =>
      canLog('debug') && console.log(message, ...optionalParams),
    error: (message?: any, ...optionalParams: any[]) =>
      canLog('error') && console.error(message, ...optionalParams),
    info: (message?: any, ...optionalParams: any[]) =>
      canLog('info') && console.info(message, ...optionalParams),
    warn: (message?: any, ...optionalParams: any[]) =>
      canLog('warn') && console.warn(message, ...optionalParams),
  };
}
