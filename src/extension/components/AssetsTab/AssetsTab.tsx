import { Spacer, TabPanel, VStack } from '@chakra-ui/react';
import React, { type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AssetTabLoadingItem from '@extension/components/AssetTabLoadingItem';
import EmptyState from '@extension/components/EmptyState';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import TabControlBar from '@extension/components/TabControlBar';
import AssetTabARC0200AssetItem from './AssetTabARC0200AssetItem';
import AssetTabStandardAssetItem from './AssetTabStandardAssetItem';

// constants
import { ACCOUNT_PAGE_TAB_CONTENT_HEIGHT } from '@extension/constants';

// features
import { setAccountId as setAddAssetAccountId } from '@extension/features/add-assets';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';

// selectors
import {
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectARC0200AssetsFetching,
  useSelectARC0200AssetsUpdating,
  useSelectStandardAssetsFetching,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectSettingsSelectedNetwork,
  useSelectStandardAssetsUpdating,
} from '@extension/selectors';

// types
import type {
  IStandardAsset,
  IARC0200Asset,
  IAppThunkDispatch,
  IMainRootState,
} from '@extension/types';
import type { IProps } from './types';

const AssetsTab: FC<IProps> = ({ _context, account }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const arc0200Assets = useSelectARC0200AssetsBySelectedNetwork();
  const fetchingARC0200Assets = useSelectARC0200AssetsFetching();
  const fetchingStandardAssets = useSelectStandardAssetsFetching();
  const selectedNetwork = useSelectSettingsSelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  const updatingARC0200Assets = useSelectARC0200AssetsUpdating();
  const updatingStandardAssets = useSelectStandardAssetsUpdating();
  // hooks
  const accountInformation = useAccountInformation(account.id);
  // misc
  const allAssetHoldings = accountInformation
    ? [
        ...accountInformation.arc200AssetHoldings.map(({ amount, id }) => ({
          amount,
          id,
          isARC0200: true,
        })),
        ...accountInformation.standardAssetHoldings.map(({ amount, id }) => ({
          amount,
          id,
          isARC0200: false,
        })),
      ]
    : [];
  // handlers
  const handleAddAssetClick = () => dispatch(setAddAssetAccountId(account.id));
  // renders
  const renderContent = () => {
    let assetNodes: ReactNode[] = [];

    if (fetchingARC0200Assets || fetchingStandardAssets) {
      return Array.from({ length: 3 }, (_, index) => (
        <AssetTabLoadingItem
          key={`${_context}-asset-tab-loading-item-${index}`}
        />
      ));
    }

    if (selectedNetwork && accountInformation && allAssetHoldings.length > 0) {
      assetNodes = allAssetHoldings.reduce<ReactNode[]>(
        (acc, { amount, id, isARC0200 }, currentIndex) => {
          const key = `${_context}-asset-tab-item-${currentIndex}`;
          let arc200Asset: IARC0200Asset | null;
          let standardAsset: IStandardAsset | null;

          // for standard assets
          if (!isARC0200) {
            standardAsset =
              standardAssets.find((value) => value.id === id) || null;

            if (!standardAsset) {
              return acc;
            }

            return [
              ...acc,
              <AssetTabStandardAssetItem
                amount={amount}
                key={key}
                network={selectedNetwork}
                standardAsset={standardAsset}
              />,
            ];
          }

          arc200Asset = arc0200Assets.find((value) => value.id === id) || null;

          if (!arc200Asset) {
            return acc;
          }

          return [
            ...acc,
            <AssetTabARC0200AssetItem
              amount={amount}
              arc0200Asset={arc200Asset}
              key={key}
              network={selectedNetwork}
            />,
          ];
        },
        []
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
          description={t<string>('captions.noAssetsFound')}
          text={t<string>('headings.noAssetsFound')}
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
      {/*controls*/}
      <TabControlBar
        _context={`${_context}-asset-tab`}
        buttons={[
          {
            button: {
              ['aria-label']: t<string>('buttons.addAsset'),
              icon: <IoAddCircleOutline />,
              onClick: handleAddAssetClick,
              size: 'sm',
              variant: 'ghost',
            },
            tooltipLabel: t<string>('buttons.addAsset'),
          },
        ]}
        isLoading={updatingARC0200Assets || updatingStandardAssets}
        loadingTooltipLabel={t<string>('captions.updatingAssetInformation')}
      />

      {renderContent()}
    </TabPanel>
  );
};

export default AssetsTab;
