import {
  HStack,
  Spacer,
  Spinner,
  TabPanel,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAddCircleOutline, IoAddOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import AssetTabLoadingItem from '@extension/components/AssetTabLoadingItem';
import EmptyState from '@extension/components/EmptyState';
import IconButton from '@extension/components/IconButton';
import ScrollableContainer from '@extension/components/ScrollableContainer';
import AssetTabARC0200AssetItem from './AssetTabARC0200AssetItem';
import AssetTabStandardAssetItem from './AssetTabStandardAssetItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import { setAccountId as setAddAssetAccountId } from '@extension/features/add-assets';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useItemBorderColor from '@extension/hooks/useItemBorderColor';

// selectors
import {
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectARC0200AssetsFetching,
  useSelectARC0200AssetsUpdating,
  useSelectStandardAssetsFetching,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectSelectedNetwork,
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

const AssetsTab: FC<IProps> = ({ account }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const arc0200Assets = useSelectARC0200AssetsBySelectedNetwork();
  const fetchingARC0200Assets = useSelectARC0200AssetsFetching();
  const fetchingStandardAssets = useSelectStandardAssetsFetching();
  const selectedNetwork = useSelectSelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  const updatingARC0200Assets = useSelectARC0200AssetsUpdating();
  const updatingStandardAssets = useSelectStandardAssetsUpdating();
  // hooks
  const accountInformation = useAccountInformation(account.id);
  const defaultTextColor = useDefaultTextColor();
  const itemBorderColor = useItemBorderColor();
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
        <AssetTabLoadingItem key={`asset-tab-loading-item-${index}`} />
      ));
    }

    if (selectedNetwork && accountInformation && allAssetHoldings.length > 0) {
      assetNodes = allAssetHoldings.reduce<ReactNode[]>(
        (acc, { amount, id, isARC0200 }, currentIndex) => {
          const key: string = `asset-tab-item-${currentIndex}`;
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
      <>
        {/*controls*/}
        <HStack
          alignItems="center"
          borderBottomColor={itemBorderColor}
          borderBottomStyle="solid"
          borderBottomWidth="1px"
          justifyContent="flex-start"
          px={DEFAULT_GAP / 2}
          py={DEFAULT_GAP / 3}
          spacing={1}
          w="full"
        >
          {/*updating asset spinner*/}
          {updatingARC0200Assets ||
            (updatingStandardAssets && (
              <Tooltip
                aria-label="Updating asset information spinner"
                label={t<string>('captions.updatingAssetInformation')}
              >
                <Spinner
                  thickness="1px"
                  speed="0.65s"
                  color={defaultTextColor}
                  size="sm"
                />
              </Tooltip>
            ))}

          <Spacer />

          {/*add asset button*/}
          <Tooltip label={t<string>('buttons.addAsset')}>
            <IconButton
              aria-label="Add asset"
              icon={IoAddCircleOutline}
              onClick={handleAddAssetClick}
              size="sm"
              variant="ghost"
            />
          </Tooltip>
        </HStack>

        {/*asset list*/}
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
      </>
    ) : (
      <VStack flexGrow={1} w="full">
        <Spacer />

        {/*empty state*/}
        <EmptyState
          button={{
            icon: IoAddOutline,
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
      height="70vh"
      m={0}
      p={0}
      sx={{ display: 'flex', flexDirection: 'column' }}
      w="full"
    >
      {renderContent()}
    </TabPanel>
  );
};

export default AssetsTab;
