// constants
import { EVENT_QUEUE_ITEM_KEY } from '@extension/constants';

// enums
import { EventTypeEnum } from '@extension/enums';

// services
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { TEvents } from '@extension/types';

export default class EventQueueService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.storageManager = new StorageManager();
  }

  /**
   * public functions
   */

  /**
   * Gets all the events.
   * @returns {Promise<TEvents[]>} all the events.
   */
  public async getAll(): Promise<TEvents[]> {
    const items = await this.storageManager.getAllItems();

    return (items[EVENT_QUEUE_ITEM_KEY] as TEvents[]) || [];
  }

  /**
   * Gets the events for a given type.
   * @param {EventTypeEnum} type - the event type.
   * @returns {Promise<TEvents[]>} a promise that resolves to all the events by type.
   */
  public async getByType<Type extends TEvents>(
    type: EventTypeEnum
  ): Promise<Type[]> {
    const events = await this.getAll();

    return events.filter((value) => value.type === type) as Type[];
  }

  /**
   * Gets the event for a given ID.
   * @param {string} id - the event ID.
   * @returns {Promise<TEvents | null>} the event or null.
   */
  public async getById(id: string): Promise<TEvents | null> {
    const events = await this.getAll();

    return events.find((value) => value.id === id) || null;
  }

  /**
   * Removes an event by its ID.
   * @param {string} id - the event ID.
   */
  public async removeById(id: string): Promise<void> {
    const messages = await this.getAll();

    await this.storageManager.setItems({
      [EVENT_QUEUE_ITEM_KEY]: messages.filter((value) => value.id !== id),
    });
  }

  /**
   * Saves an event to the event queue. If an event with the same ID exists, it will replace it.
   * @param {Event extends TEvents} event - the event to add or replace.
   * @returns {Promise<Event extends TEvents>} a promise that resolves to the event that was added to the queue.
   */
  public async save<Event extends TEvents>(event: Event): Promise<Event> {
    const events = await this.getAll();
    let existingIndex: number;

    existingIndex = events.findIndex((value) => value.id === event.id);

    // the message exists, replace it
    if (existingIndex >= 0) {
      events[existingIndex] = event;

      await this.storageManager.setItems({
        [EVENT_QUEUE_ITEM_KEY]: events,
      });

      return event;
    }

    await this.storageManager.setItems({
      [EVENT_QUEUE_ITEM_KEY]: [...events, event],
    });

    return event;
  }
}
