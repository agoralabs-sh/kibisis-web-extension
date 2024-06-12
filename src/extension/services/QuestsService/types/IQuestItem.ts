/**
 * @property {number} lastCompletedAt - a timestamp (in milliseconds) for when the quest was last completed. For
 * uncompleted quests, this value will be -1.
 * @property {string} name - the name of the quest.
 */
interface IQuestItem {
  lastCompletedAt: number;
  name: string;
}

export default IQuestItem;
