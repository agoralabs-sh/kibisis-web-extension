import browser, { Alarms } from 'webextension-polyfill';

// constants
import { HEARTBEAT_ALARM, HEARTBEAT_DURATION } from '@extension/constants';

// types
import type { IBaseOptions, ILogger } from '@common/types';

// utils
import convertMillisecondsToMinutes from '@extension/utils/convertMillisecondsToMinutes';

/**
 * Due to Chrome's killing of service workers, events are not triggered until the extension's service worker is
 * "awoken". This causes some issues like the extension button having to pressed twice to first "wake up" the extension
 * then actually fire the event.
 * This services addresses this by creating an alarm that ticks every 20 seconds to keep the service worker awake.
 * {@see @link https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle#idle-shutdown}
 */
export default class HeartbeatService {
  // private variables
  private logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
  }

  /**
   * public functions
   */

  public async clearAlarm(): Promise<void> {
    const _functionName: string = 'clearAlarm';

    this.logger?.debug(
      `${HeartbeatService.name}#${_functionName}: clearing heartbeat alarm`
    );

    await browser.alarms.clear(HEARTBEAT_ALARM);
  }

  /**
   * Creates an alarm. If an alarm already exists, the existing alarm is returned.
   */
  public async createOrGetAlarm(): Promise<Alarms.Alarm | null> {
    const _functionName: string = 'createAlarm';
    const periodInMinutes: number =
      convertMillisecondsToMinutes(HEARTBEAT_DURATION);
    let alarm: Alarms.Alarm | null = await this.getAlarm();

    // if the alarm already exists, return it
    if (alarm) {
      return alarm;
    }

    this.logger?.debug(
      `${HeartbeatService.name}#${_functionName}: creating new heartbeat alarm to tick every ${periodInMinutes} minute(s)`
    );

    // create a new alarm
    browser.alarms.create(HEARTBEAT_ALARM, {
      periodInMinutes,
    });

    return await this.getAlarm();
  }

  public async getAlarm(): Promise<Alarms.Alarm | null> {
    return (await browser.alarms.get(HEARTBEAT_ALARM)) || null;
  }
}
