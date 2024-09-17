import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AssetTabLoadingItem from '@extension/components/AssetTabLoadingItem';
import EmptyState from '@extension/components/EmptyState';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import NFTsTabARC0072AssetItem from './NFTsTabARC0072AssetItem';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@extension/constants';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';

// selectors
import {
  useSelectARC0072AssetsFetching,
  useSelectSettingsSelectedNetwork,
} from '@extension/selectors';

// types
import type { INFTsTabProps } from './types';

const NFTsTab: FC<INFTsTabProps> = ({ account }) => {
  const { t } = useTranslation();
  // selectors
  const fetchingARC0072Assets = useSelectARC0072AssetsFetching();
  const selectedNetwork = useSelectSettingsSelectedNetwork();
  // hooks
  const accountInformation = useAccountInformation(account.id);
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
      <ScrollableContainer
        direction="column"
        m={0}
        pb={8}
        pt={0}
        px={0}
        spacing={0}
        w="full"
      >
        {assetNodes}
      </ScrollableContainer>
    ) : (
      <VStack flexGrow={1} w="full">
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
      height={ACCOUNT_PAGE_TAB_CONTENT_HEIGHT}
      m={0}
      p={0}
      sx={{ display: 'flex', flexDirection: 'column' }}
      w="full"
    >
      {renderContent()}
    </TabPanel>
  );
};

export default NFTsTab;
