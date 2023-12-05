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
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd, IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

// components
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import EmptyState from '@extension/components/EmptyState';

// constants
import { ACCOUNTS_ROUTE, ASSETS_ROUTE } from '@extension/constants';

// hooks
import useAccountInformation from '@extension/hooks/useAccountInformation';
import useAssets from '@extension/hooks/useAssets';
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectFetchingAssets,
  useSelectSelectedNetwork,
  useSelectUpdatingAssets,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// types
import {
  IAccount,
  IAccountInformation,
  IAsset,
  INetwork,
} from '@extension/types';

// utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';

interface IProps {
  account: IAccount;
}

const AccountAssetsTab: FC<IProps> = ({ account }: IProps) => {
  const { t } = useTranslation();
  // selectors
  const fetching: boolean = useSelectFetchingAssets();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const updating: boolean = useSelectUpdatingAssets();
  // hooks
  const accountInformation: IAccountInformation | null = useAccountInformation(
    account.id
  );
  const assets: IAsset[] = useAssets();
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
  const subTextColor: string = useSubTextColor();
  const handleAddAssetClick = () => console.log('add an asset!');
  const renderContent = () => {
    let assetNodes: ReactNode[] = [];

    if (fetching || updating) {
      return Array.from({ length: 3 }, (_, index) => (
        <Button
          borderRadius={0}
          fontSize="md"
          h={16}
          justifyContent="start"
          key={`account-assets-fetching-item-${index}`}
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

    if (accountInformation && accountInformation.assetHoldings.length > 0) {
      assetNodes = accountInformation.assetHoldings.reduce<ReactNode[]>(
        (acc, assetHolding, currentIndex) => {
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
              key={`account-asset-asset-holding-item-${currentIndex}`}
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
                to={`${ACCOUNTS_ROUTE}/${AccountService.convertPublicKeyToAlgorandAddress(
                  account.publicKey
                )}${ASSETS_ROUTE}/${asset.id}`}
                variant="ghost"
                w="full"
              >
                <HStack alignItems="center" m={0} p={0} spacing={2} w="full">
                  {/*icon*/}
                  <AssetAvatar
                    asset={asset}
                    fallbackIcon={
                      <AssetIcon
                        color={primaryButtonTextColor}
                        networkTheme={selectedNetwork?.chakraTheme}
                        h={6}
                        w={6}
                      />
                    }
                    size="sm"
                  />

                  {/*name/unit*/}
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

                  {/*amount*/}
                  <Text color={defaultTextColor} fontSize="sm">
                    {formatCurrencyUnit(standardUnitAmount, asset.decimals)}
                  </Text>
                </HStack>
              </Button>
            </Tooltip>,
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

export default AccountAssetsTab;
