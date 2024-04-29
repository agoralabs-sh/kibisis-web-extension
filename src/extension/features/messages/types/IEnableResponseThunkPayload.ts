import type { IEnableParams } from '@agoralabs-sh/avm-web-provider';

// features
import type { IBaseResponseThunkPayload } from '@extension/features/messages';

// types
import type { ISession } from '@extension/types';

interface IEnableResponseThunkPayload
  extends IBaseResponseThunkPayload<IEnableParams> {
  session: ISession | null;
}

export default IEnableResponseThunkPayload;
