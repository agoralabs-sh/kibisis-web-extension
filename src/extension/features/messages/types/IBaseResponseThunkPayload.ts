// errors
import { BaseSerializableArc0013Error } from '@common/errors';

interface IBaseResponseThunkPayload {
  error: BaseSerializableArc0013Error | null;
  eventId: string;
  originTabId: number;
}

export default IBaseResponseThunkPayload;
