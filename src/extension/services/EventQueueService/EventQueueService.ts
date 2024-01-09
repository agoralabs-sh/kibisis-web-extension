// constants
import { EVENT_QUEUE_ITEM_KEY } from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { IClientEvent } from '@extension/types';

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
   * @returns {Promise<IClientEvent[]>} all the events.
   */
  public async getAll(): Promise<IClientEvent[]> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();

    return (items[EVENT_QUEUE_ITEM_KEY] as IClientEvent[]) || [];
  }

  /**
   * Gets the event for a given ID.
   * @param {string} id - the event ID.
   * @returns {Promise<IClientEvent | null>} the event or null.
   */
  public async getById(id: string): Promise<IClientEvent | null> {
    const events: IClientEvent[] = await this.getAll();

    return events.find((value) => value.id === id) || null;
  }

  /**
   * Removes an event by its ID.
   * @param {string} id - the event ID.
   */
  public async removeById(id: string): Promise<void> {
    const messages: IClientEvent[] = await this.getAll();

    await this.storageManager.setItems({
      [EVENT_QUEUE_ITEM_KEY]: messages.filter((value) => value.id !== id),
    });
  }

  /**
   * Saves an event to the event queue. If an event with the same ID exists, it will replace it.
   * @param {IClientEvent} event - the event to add or replace.
   * @returns {IClientEvent} the message that was added to the queue.
   */
  public async save(event: IClientEvent): Promise<IClientEvent> {
    let existingIndex: number;
    let events: IClientEvent[];

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
