// constants
import { EVENT_QUEUE_ITEM_KEY } from '@extension/constants';

// services
import StorageManager from './StorageManager';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { IEvent } from '@extension/types';

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
   * @returns {Promise<IEvent[]>} all the events.
   */
  public async getAll(): Promise<IEvent[]> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();

    return (items[EVENT_QUEUE_ITEM_KEY] as IEvent[]) || [];
  }

  /**
   * Gets the event for a given ID.
   * @param {string} id - the event ID.
   * @returns {Promise<IEvent | null>} the event or null.
   */
  public async getById(id: string): Promise<IEvent | null> {
    const events: IEvent[] = await this.getAll();

    return events.find((value) => value.id === id) || null;
  }

  /**
   * Removes an event by its ID.
   * @param {string} id - the event ID.
   */
  public async removeById(id: string): Promise<void> {
    const messages: IEvent[] = await this.getAll();

    await this.storageManager.setItems({
      [EVENT_QUEUE_ITEM_KEY]: messages.filter((value) => value.id !== id),
    });
  }

  /**
   * Saves an event to the event queue. If an event with the same ID exists, it will replace it.
   * @param {IEvent} event - the event to add or replace.
   * @returns {IEvent} the message that was added to the queue.
   */
  public async save(event: IEvent): Promise<IEvent> {
    let existingIndex: number;
    let events: IEvent[];

    events = await this.getAll();
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
