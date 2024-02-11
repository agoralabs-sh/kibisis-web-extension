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
import { IoAdd } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@extension/components/Button';
import EmptyState from '@extension/components/EmptyState';
import AssetTabArc200AssetItem from './AssetTabArc200AssetItem';
import AssetTabLoadingItem from './AssetTabLoadingItem';
import AssetTabStandardAssetItem from './AssetTabStandardAssetItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// features
import { setAccountId as setAddAssetAccountId } from '@extension/features/add-asset';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import {
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectFetchingARC0200Assets,
  useSelectFetchingStandardAssets,
  useSelectStandardAssetsBySelectedNetwork,
  useSelectSelectedNetwork,
  useSelectUpdatingArc200Assets,
  useSelectUpdatingStandardAssets,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAccountInformation,
  IStandardAsset,
  INetwork,
  IARC0200Asset,
  IAppThunkDispatch,
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
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const arc200Assets: IARC0200Asset[] =
    useSelectARC0200AssetsBySelectedNetwork();
  const fetchingArc200Assets: boolean = useSelectFetchingARC0200Assets();
  const fetchingStandardAssets: boolean = useSelectFetchingStandardAssets();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const standardAssets: IStandardAsset[] =
    useSelectStandardAssetsBySelectedNetwork();
  const updatingArc200Assets: boolean = useSelectUpdatingArc200Assets();
  const updatingStandardAssets: boolean = useSelectUpdatingStandardAssets();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
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
  const handleAddAssetClick = () => dispatch(setAddAssetAccountId(account.id));
  // renders
  const renderContent = () => {
    let assetNodes: ReactNode[] = [];

    if (fetchingArc200Assets || fetchingStandardAssets) {
      return Array.from({ length: 3 }, (_, index) => (
        <AssetTabLoadingItem key={`asset-tab-loading-item-${index}`} />
      ));
    }

    if (selectedNetwork && accountInformation && allAssetHoldings.length > 0) {
      assetNodes = allAssetHoldings.reduce<ReactNode[]>(
        (acc, { amount, id, isArc200 }, currentIndex) => {
          const key: string = `asset-tab-item-${currentIndex}`;
          let arc200Asset: IARC0200Asset | null;
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
          justifyContent="flex-start"
          px={DEFAULT_GAP / 2}
          py={DEFAULT_GAP / 3}
          spacing={1}
          w="full"
        >
          {/*updating asset spinner*/}
          {updatingArc200Assets ||
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

          {/*add asset*/}
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
