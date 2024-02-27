import { useState } from 'react';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AssetTypeEnum } from '@extension/enums';

// selectors
import { useSelectLogger } from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type { IAccountInformation } from '@extension/types';
import type {
  IUpdateAccountInformationAndAssetHoldingsActionOptions,
  IUseAccountInformationAndAssetHoldingsState,
} from './types';

// utils
import updateAccountInformation from '@extension/utils/updateAccountInformation';

export default function useAccountInformationAndAssetHoldings(): IUseAccountInformationAndAssetHoldingsState {
  // selectors
  const logger: ILogger = useSelectLogger();
  // state
  const [accountInformation, setAccountInformation] =
    useState<IAccountInformation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const updateAccountInformationAndAssetHoldingsAction = async ({
    address,
    arc0200Assets,
    network,
  }: IUpdateAccountInformationAndAssetHoldingsActionOptions) => {
    let accountInformation: IAccountInformation;

    setLoading(true);

    accountInformation = await updateAccountInformation({
      address,
      delay: NODE_REQUEST_DELAY,
      currentAccountInformation: {
        ...AccountService.initializeDefaultAccountInformation(),
        // for each arc-0200 asset we have, initialize the account information with them "added"
        arc200AssetHoldings: arc0200Assets.map(({ id }) => ({
          amount: '0',
          id,
          type: AssetTypeEnum.ARC0200,
        })),
      },
      logger,
      network,
    });

    setAccountInformation(accountInformation);
    setLoading(false);
  };

  return {
    accountInformation,
    loading,
    updateAccountInformationAndAssetHoldingsAction,
  };
}
