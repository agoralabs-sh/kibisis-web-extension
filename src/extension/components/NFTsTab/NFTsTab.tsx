import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetTabLoadingItem from '@extension/components/AssetTabLoadingItem';
import EmptyState from '@extension/components/EmptyState';
import NFTsTabARC0072AssetItem from './NFTsTabARC0072AssetItem';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';

// selectors
import {
  useSelectARC0072AssetsFetching,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// types
import type { IAccountInformation, INetwork } from '@extension/types';
import type { INFTsTabProps } from './types';

const NFTsTab: FC<INFTsTabProps> = ({ account }) => {
  const { t } = useTranslation();
  // selectors
  const fetchingARC0072Assets: boolean = useSelectARC0072AssetsFetching();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // hooks
  const accountInformation: IAccountInformation | null = useAccountInformation(
    account.id
  );
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
