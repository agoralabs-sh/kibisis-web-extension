import {
  Button,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  Spacer,
  TabPanel,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd, IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// Components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import EmptyState from '@extension/components/EmptyState';

// Constants
import { ACCOUNTS_ROUTE, ASSETS_ROUTE } from '@extension/constants';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAssetsByGenesisHash,
  useSelectFetchingAssets,
  useSelectNetworkByGenesisHash,
  useSelectUpdatingAssets,
} from '@extension/selectors';

// Types
import { IAccount, IAsset, INetwork } from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@extension/utils';

interface IProps {
  account: IAccount;
}

const AccountAssetsTab: FC<IProps> = ({ account }: IProps) => {
  const { t } = useTranslation();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(account.genesisHash);
  const fetching: boolean = useSelectFetchingAssets();
  const network: INetwork | null = useSelectNetworkByGenesisHash(
    account.genesisHash
  );
  const updating: boolean = useSelectUpdatingAssets();
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const handleAddAssetClick = () => console.log('add an asset!');
  const renderContent = () => {
    if (fetching || updating) {
      return Array.from({ length: 3 }, () => (
        <Button
          borderRadius={0}
          fontSize="md"
          h={16}
          justifyContent="start"
          key={nanoid()}
          pl={3}
          pr={1}
          py={0}
          variant="ghost"
          w="full"
        >
          <HStack m={0} p={0} spacing={2} w="full">
            <SkeletonCircle size="9" />
            <Skeleton flexGrow={1}>
              <Text color={defaultTextColor} fontSize="sm">
                {faker.company.bsBuzz()}
              </Text>
            </Skeleton>
            <Skeleton>
              <Text color={defaultTextColor} fontSize="sm">
                {faker.random.numeric(3)}
              </Text>
            </Skeleton>
          </HStack>
        </Button>
      ));
    }

    if (account.assets.length > 0) {
      return account.assets.reduce<ReactNode[]>((acc, assetHolding) => {
        const asset: IAsset | null =
          assets.find((value) => value.id === assetHolding.id) || null;
        let standardUnitAmount: BigNumber;

        if (!asset) {
          return acc;
        }

        standardUnitAmount = convertToStandardUnit(
          new BigNumber(assetHolding.amount),
          asset.decimals
        );

        return [
          ...acc,
          <Tooltip
            aria-label="Asset"
            key={nanoid()}
            label={asset.name || asset.id}
          >
            <Button
              _hover={{
                bg: buttonHoverBackgroundColor,
              }}
              as={Link}
              borderRadius={0}
              fontSize="md"
              h={16}
              justifyContent="start"
              pl={3}
              pr={1}
              py={0}
              rightIcon={
                <Icon
                  as={IoChevronForward}
                  color={defaultTextColor}
                  h={6}
                  w={6}
                />
              }
              to={`${ACCOUNTS_ROUTE}/${account.address}${ASSETS_ROUTE}/${asset.id}`}
              variant="ghost"
              w="full"
            >
              <HStack alignItems="center" m={0} p={0} spacing={2} w="full">
                {/* Icon */}
                <AssetAvatar
                  asset={asset}
                  fallbackIcon={
                    <AssetIcon
                      color={primaryButtonTextColor}
                      networkTheme={network?.chakraTheme}
                      h={6}
                      w={6}
                    />
                  }
                  size="sm"
                />
                {/* Name/unit */}
                {asset.unitName ? (
                  <VStack
                    alignItems="flex-start"
                    flexGrow={1}
                    justifyContent="space-between"
                    spacing={0}
                  >
                    <Text
                      color={defaultTextColor}
                      fontSize="sm"
                      maxW={175}
                      noOfLines={1}
                    >
                      {asset.name || asset.id}
                    </Text>
                    <Text color={subTextColor} fontSize="xs">
                      {asset.unitName}
                    </Text>
                  </VStack>
                ) : (
                  <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
                    {asset.name || asset.id}
                  </Text>
                )}
                {/* Amount */}
                <Text color={defaultTextColor} fontSize="sm">
                  {formatCurrencyUnit(standardUnitAmount)}
                </Text>
              </HStack>
            </Button>
          </Tooltip>,
        ];
      }, []);
    }

    return (
      <>
        {/* Empty state */}
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

export default AccountAssetsTab;
