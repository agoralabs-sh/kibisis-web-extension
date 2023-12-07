// errors
import { BaseSerializableError } from '@common/errors';

interface IBaseResponseThunkPayload {
  error: BaseSerializableError | null;
  eventId: string;
  tabId: number;
}

export default IBaseResponseThunkPayload;
