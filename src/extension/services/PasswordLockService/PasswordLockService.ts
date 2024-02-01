import browser, { Alarms } from 'webextension-polyfill';

// constants
import { PASSWORD_LOCK_ALARM } from '@extension/constants';

// types
import type { IBaseOptions, ILogger } from '@common/types';

export default class PasswordLockService {
  // private variables
  private logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
  }

  /**
   * private functions
   */

  private convertMillisecondsToMinutes(valueInMilliseconds: number): number {
    return valueInMilliseconds / 60000;
  }

  /**
   * public functions
   */

  public async clearAlarm(): Promise<void> {
    await browser.alarms.clear(PASSWORD_LOCK_ALARM);
  }

  public async createAlarm(
    timeoutInMilliseconds: number
  ): Promise<Alarms.Alarm | null> {
    // create a new alarm
    browser.alarms.create(PASSWORD_LOCK_ALARM, {
      delayInMinutes: this.convertMillisecondsToMinutes(timeoutInMilliseconds),
    });

    return (await browser.alarms.get(PASSWORD_LOCK_ALARM)) || null;
  }

  public async restartAlarm(
    timeoutInMilliseconds: number
  ): Promise<Alarms.Alarm | null> {
    // clear the previous alarm
    await this.clearAlarm();

    // create a new alarm
    return await this.createAlarm(timeoutInMilliseconds);
  }
}
