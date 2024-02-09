// errors
import { BaseSerializableARC0027Error } from '@common/errors';

interface IBaseResponseThunkPayload {
  error: BaseSerializableARC0027Error | null;
  eventId: string;
  originTabId: number;
}

export default IBaseResponseThunkPayload;
