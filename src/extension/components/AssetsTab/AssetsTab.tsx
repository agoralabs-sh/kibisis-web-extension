import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd } from 'react-icons/io5';

// components
import EmptyState from '@extension/components/EmptyState';
import AssetTabLoadingItem from './AssetTabLoadingItem';
import AssetTabStandardAssetItem from './AssetTabStandardAssetItem';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';

// selectors
import {
  useSelectFetchingStandardAssets,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectSelectedNetwork,
  useSelectUpdatingStandardAssets,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAccountInformation,
  IStandardAsset,
  INetwork,
} from '@extension/types';

interface IProps {
  account: IAccount;
}

const AssetsTab: FC<IProps> = ({ account }: IProps) => {
  const { t } = useTranslation();
  // selectors
  const fetching: boolean = useSelectFetchingStandardAssets();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const standardAssets: IStandardAsset[] =
    useSelectStandardAssetsBySelectedNetwork();
  const updating: boolean = useSelectUpdatingStandardAssets();
  // hooks
  const accountInformation: IAccountInformation | null = useAccountInformation(
    account.id
  );
  const handleAddAssetClick = () => console.log('add an asset!');
  const renderContent = () => {
    let assetNodes: ReactNode[] = [];

    if (fetching || updating) {
      return Array.from({ length: 3 }, (_, index) => (
        <AssetTabLoadingItem key={`asset-tab-loading-item-${index}`} />
      ));
    }

    if (
      selectedNetwork &&
      accountInformation &&
      accountInformation.standardAssetHoldings.length > 0
    ) {
      assetNodes = accountInformation.standardAssetHoldings.reduce<ReactNode[]>(
        (acc, standardAssetHolding, currentIndex) => {
          const standardAsset: IStandardAsset | null =
            standardAssets.find(
              (value) => value.id === standardAssetHolding.id
            ) || null;

          if (!standardAsset) {
            return acc;
          }

          return [
            ...acc,
            <AssetTabStandardAssetItem
              account={account}
              key={`asset-tab-item-${currentIndex}`}
              network={selectedNetwork}
              standardAsset={standardAsset}
              standardAssetHolding={standardAssetHolding}
            />,
          ];
        },
        []
      );
    }

    return assetNodes.length > 0 ? (
      assetNodes
    ) : (
      <>
        {/*empty state*/}
        <Spacer />

        <EmptyState
          button={{
            icon: IoAdd,
            label: t<string>('buttons.addAsset'),
            onClick: handleAddAssetClick,
          }}
          description={t<string>('captions.noAssetsFound')}
          text={t<string>('headings.noAssetsFound')}
        />

        <Spacer />
      </>
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
      <VStack flexGrow={1} m={0} p={0} spacing={0} w="full">
        {renderContent()}
      </VStack>
    </TabPanel>
  );
};

export default AssetsTab;
