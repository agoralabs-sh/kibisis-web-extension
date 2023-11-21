// errors
import { BaseSerializableError } from '@common/errors';

interface IBaseResponseThunkPayload {
  error: BaseSerializableError | null;
  requestEventId: string;
  tabId: number;
}

export default IBaseResponseThunkPayload;
