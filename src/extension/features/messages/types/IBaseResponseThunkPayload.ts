// errors
import { BaseSerializableLegacyError } from '@common/errors';

interface IBaseResponseThunkPayload {
  error: BaseSerializableLegacyError | null;
  eventId: string;
  tabId: number;
}

export default IBaseResponseThunkPayload;
