import type { TAccountIcons } from '@extension/types';

interface ISaveAccountDetailsPayload {
  accountId: string;
  icon: TAccountIcons | null;
  name: string;
}

export default ISaveAccountDetailsPayload;
