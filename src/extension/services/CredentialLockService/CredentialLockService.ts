import browser, { Alarms } from 'webextension-polyfill';

// constants
import { CREDENTIAL_LOCK_ALARM } from '@extension/constants';

// types
import type { IBaseOptions, ILogger } from '@common/types';

// utils
import convertMillisecondsToMinutes from '@extension/utils/convertMillisecondsToMinutes';

export default class CredentialLockService {
  // private variables
  private _logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this._logger = logger || null;
  }

  /**
   * public functions
   */

  public async clearAlarm(): Promise<void> {
    const _functionName = 'clearAlarm';

    this._logger?.debug(
      `${CredentialLockService.name}#${_functionName}: clearing credential lock alarm`
    );

    await browser.alarms.clear(CREDENTIAL_LOCK_ALARM);
  }

  public async createAlarm(
    timeoutInMilliseconds: number
  ): Promise<Alarms.Alarm | null> {
    const _functionName = 'createAlarm';
    const delayInMinutes = convertMillisecondsToMinutes(timeoutInMilliseconds);

    this._logger?.debug(
      `${CredentialLockService.name}#${_functionName}: creating credential lock alarm to expire in ${delayInMinutes} minute(s)`
    );

    // create a new alarm
    browser.alarms.create(CREDENTIAL_LOCK_ALARM, {
      delayInMinutes,
    });

    return await this.getAlarm();
  }

  public async getAlarm(): Promise<Alarms.Alarm | null> {
    return (await browser.alarms.get(CREDENTIAL_LOCK_ALARM)) || null;
  }

  public async restartAlarm(
    timeoutInMilliseconds: number
  ): Promise<Alarms.Alarm | null> {
    const _functionName = 'restartAlarm';

    // clear the previous alarm
    await this.clearAlarm();

    this._logger?.debug(
      `${
        CredentialLockService.name
      }#${_functionName}: restarting credential lock alarm to expire in ${convertMillisecondsToMinutes(
        timeoutInMilliseconds
      )} minute(s)`
    );

    // create a new alarm
    return await this.createAlarm(timeoutInMilliseconds);
  }
}
