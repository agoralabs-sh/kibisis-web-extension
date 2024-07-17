import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetTabLoadingItem from '@extension/components/AssetTabLoadingItem';
import EmptyState from '@extension/components/EmptyState';
import NFTsTabARC0072AssetItem from './NFTsTabARC0072AssetItem';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';
import usePrevious from '@extension/hooks/usePrevious';

// selectors
import {
  useSelectARC0072AssetsFetching,
  useSelectLogger,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import QuestsService from '@extension/services/QuestsService';

// types
import type {
  IAccountInformation,
  IARC0072AssetHolding,
  INetwork,
} from '@extension/types';
import type { INFTsTabProps } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const NFTsTab: FC<INFTsTabProps> = ({ account }) => {
  const { t } = useTranslation();
  // selectors
  const fetchingARC0072Assets: boolean = useSelectARC0072AssetsFetching();
  const logger = useSelectLogger();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // hooks
  const accountInformation: IAccountInformation | null = useAccountInformation(
    account.id
  );
  const previousARC0027AssetHoldings = usePrevious<
    IARC0072AssetHolding[] | null
  >(accountInformation?.arc0072AssetHoldings || null);
  // renders
  const renderContent = () => {
    let assetNodes: ReactNode[] = [];

    if (fetchingARC0072Assets) {
      return Array.from({ length: 3 }, (_, index) => (
        <AssetTabLoadingItem key={`nft-tab-loading-item-${index}`} />
      ));
    }

    if (selectedNetwork && accountInformation) {
      assetNodes = accountInformation.arc0072AssetHoldings.map(
        (value, index) => (
          <NFTsTabARC0072AssetItem
            arc0072AssetHolding={value}
            key={`nfts-tab-nft-item-${index}`}
            network={selectedNetwork}
          />
        )
      );
    }

    return assetNodes.length > 0 ? (
      // asset list
      <VStack flexGrow={1} m={0} p={0} spacing={0} w="full">
        {assetNodes}
      </VStack>
    ) : (
      <VStack flexGrow={1} m={0} p={0} spacing={0} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState
          description={t<string>('captions.noNFTsFound')}
          text={t<string>('headings.noNFTsFound')}
        />

        <Spacer />
      </VStack>
    );
  };

  // check if there are new arc-0072 assets
  useEffect(() => {
    let questsService: QuestsService;
    let newARC0072AssetHoldings: IARC0072AssetHolding[];

    if (
      previousARC0027AssetHoldings &&
      accountInformation?.arc0072AssetHoldings &&
      selectedNetwork
    ) {
      questsService = new QuestsService({
        logger,
      });
      newARC0072AssetHoldings = accountInformation.arc0072AssetHoldings.filter(
        (arc0072AssetHolding) =>
          !previousARC0027AssetHoldings.find(
            (value) => value.id === arc0072AssetHolding.id
          )
      );

      // if there are new assets acquired, track an action for each new asset
      newARC0072AssetHoldings.forEach(({ id }) =>
        questsService.acquireARC0072Quest(
          convertPublicKeyToAVMAddress(account.publicKey),
          {
            appID: id,
            genesisHash: selectedNetwork.genesisHash,
          }
        )
      );
    }
  }, [accountInformation?.arc0072AssetHoldings]);

  return (
    <TabPanel
      flexGrow={1}
      m={0}
      p={0}
      overflowY="scroll"
      sx={{ display: 'flex', flexDirection: 'column' }}
      w="full"
    >
      {renderContent()}
    </TabPanel>
  );
};

export default NFTsTab;
