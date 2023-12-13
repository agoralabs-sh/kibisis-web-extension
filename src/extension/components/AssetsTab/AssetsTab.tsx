import { HStack, Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd } from 'react-icons/io5';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import AssetTabArc200AssetItem from './AssetTabArc200AssetItem';
import AssetTabLoadingItem from './AssetTabLoadingItem';
import AssetTabStandardAssetItem from './AssetTabStandardAssetItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

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
  onAddAssetClick: () => void;
}

const AssetsTab: FC<IProps> = ({ account, onAddAssetClick }: IProps) => {
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
  const handleAddAssetClick = () => onAddAssetClick();
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
      <VStack flexGrow={1} w="full">
        {/*controls*/}
        <HStack
          alignItems="center"
          justifyContent="flex-end"
          px={DEFAULT_GAP / 2}
          py={DEFAULT_GAP / 3}
          spacing={1}
          w="full"
        >
          <Button
            leftIcon={<IoAdd />}
            onClick={handleAddAssetClick}
            size="sm"
            variant="solid"
          >
            {t<string>('buttons.addAsset')}
          </Button>
        </HStack>

        {/*asset list*/}
        <VStack flexGrow={1} m={0} p={0} spacing={0} w="full">
          {assetNodes}
        </VStack>
      </VStack>
    ) : (
      <VStack flexGrow={1} m={0} p={0} spacing={0} w="full">
        <Spacer />

        {/*empty state*/}
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

export default AssetsTab;
