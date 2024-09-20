// constants
import { EVENT_QUEUE_ITEM_KEY } from '@extension/constants';

// enums
import { EventTypeEnum } from '@extension/enums';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { TEvents } from '@extension/types';

export default class EventQueueRepository extends BaseRepository {
  /**
   * public functions
   */

  /**
   * Fetches all the events.
   * @returns {Promise<TEvents[]>} A promise that resolves to all the events.
   * @public
   */
  public async fetchAll(): Promise<TEvents[]> {
    const items = await this._fetchByKey<TEvents[]>(EVENT_QUEUE_ITEM_KEY);

    return items || [];
  }

  /**
   * Fetches the events for a given type.
   * @param {EventTypeEnum} type - The event type.
   * @returns {Promise<TEvents[]>} A promise that resolves to all the events by type.
   * @public
   */
  public async fetchByType<Type extends TEvents>(
    type: EventTypeEnum
  ): Promise<Type[]> {
    const items = await this.fetchAll();

    return items.filter((value) => value.type === type) as Type[];
  }

  /**
   * Gets the event for a given ID.
   * @param {string} id - the event ID.
   * @returns {Promise<TEvents | null>} A promise that resolves the event or null.
   * @public
   */
  public async fetchById(id: string): Promise<TEvents | null> {
    const items = await this.fetchAll();

    return items.find((value) => value.id === id) || null;
  }

  /**
   * Removes an event by its ID.
   * @param {string} id - the event ID.
   * @public
   */
  public async removeById(id: string): Promise<void> {
    const items = await this.fetchAll();

    await this._save<TEvents[]>({
      [EVENT_QUEUE_ITEM_KEY]: items.filter((value) => value.id !== id),
    });
  }

  /**
   * Saves an event to the event queue. If an event with the same ID exists, it will replace it.
   * @param {Event extends TEvents} event - the event to add or replace.
   * @returns {Promise<Event extends TEvents>} a promise that resolves to the event that was added to the queue.
   */
  public async save<Event extends TEvents>(event: Event): Promise<Event> {
    const items = await this.fetchAll();
    const existingIndex = items.findIndex((value) => value.id === event.id);

    // the message exists, replace it
    if (existingIndex >= 0) {
      items[existingIndex] = event;

      await this._save<TEvents[]>({
        [EVENT_QUEUE_ITEM_KEY]: items,
      });

      return event;
    }

    await this._save<TEvents[]>({
      [EVENT_QUEUE_ITEM_KEY]: [...items, event],
    });

    return event;
  }
}
