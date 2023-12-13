import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd } from 'react-icons/io5';

// components
import EmptyState from '@extension/components/EmptyState';
import AssetTabArc200AssetItem from './AssetTabArc200AssetItem';
import AssetTabLoadingItem from './AssetTabLoadingItem';
import AssetTabStandardAssetItem from './AssetTabStandardAssetItem';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';

// selectors
import {
  useSelectArc200AssetsBySelectedNetwork,
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
  IArc200Asset,
} from '@extension/types';

interface IAssetHolding {
  amount: string;
  id: string;
  isArc200: boolean;
}
interface IProps {
  account: IAccount;
}

const AssetsTab: FC<IProps> = ({ account }: IProps) => {
  const { t } = useTranslation();
  // selectors
  const arc200Assets: IArc200Asset[] = useSelectArc200AssetsBySelectedNetwork();
  const fetching: boolean = useSelectFetchingStandardAssets();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const standardAssets: IStandardAsset[] =
    useSelectStandardAssetsBySelectedNetwork();
  const updating: boolean = useSelectUpdatingStandardAssets();
  // hooks
  const accountInformation: IAccountInformation | null = useAccountInformation(
    account.id
  );
  // misc
  const allAssetHoldings: IAssetHolding[] = accountInformation
    ? [
        ...accountInformation.arc200AssetHoldings.map(({ amount, id }) => ({
          amount,
          id,
          isArc200: true,
        })),
        ...accountInformation.standardAssetHoldings.map(({ amount, id }) => ({
          amount,
          id,
          isArc200: false,
        })),
      ]
    : [];
  // handlers
  const handleAddAssetClick = () => console.log('add an asset!');
  // renders
  const renderContent = () => {
    let assetNodes: ReactNode[] = [];

    if (fetching || updating) {
      return Array.from({ length: 3 }, (_, index) => (
        <AssetTabLoadingItem key={`asset-tab-loading-item-${index}`} />
      ));
    }

    if (selectedNetwork && accountInformation && allAssetHoldings.length > 0) {
      assetNodes = allAssetHoldings.reduce<ReactNode[]>(
        (acc, { amount, id, isArc200 }, currentIndex) => {
          const key: string = `asset-tab-item-${currentIndex}`;
          let arc200Asset: IArc200Asset | null;
          let standardAsset: IStandardAsset | null;

          // for standard assets
          if (!isArc200) {
            standardAsset =
              standardAssets.find((value) => value.id === id) || null;

            if (!standardAsset) {
              return acc;
            }

            return [
              ...acc,
              <AssetTabStandardAssetItem
                account={account}
                amount={amount}
                key={key}
                network={selectedNetwork}
                standardAsset={standardAsset}
              />,
            ];
          }

          arc200Asset = arc200Assets.find((value) => value.id === id) || null;

          if (!arc200Asset) {
            return acc;
          }

          return [
            ...acc,
            <AssetTabArc200AssetItem
              account={account}
              amount={amount}
              arc200Asset={arc200Asset}
              key={key}
              network={selectedNetwork}
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