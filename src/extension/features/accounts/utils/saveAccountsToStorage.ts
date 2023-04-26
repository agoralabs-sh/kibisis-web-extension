// Constants
import { ACCOUNT_KEY_PREFIX } from '@extension/constants';

// Services
import { StorageManager } from '@extension/services';

// Types
import { IAccount } from '@extension/types';

export default async function saveAccountsToStorage(
  accounts: IAccount[]
): Promise<void> {
  const storageManager: StorageManager = new StorageManager();

  await storageManager.setItems(
    accounts.reduce(
      (acc, value) => ({
        ...acc,
        [`${ACCOUNT_KEY_PREFIX}${value.id}`]: value,
      }),
      {}
    )
  );
}
