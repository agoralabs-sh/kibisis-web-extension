// errors
import { BaseSerializableArc0027Error } from '@common/errors';

interface IBaseResponseThunkPayload {
  error: BaseSerializableArc0027Error | null;
  eventId: string;
  originTabId: number;
}

export default IBaseResponseThunkPayload;
