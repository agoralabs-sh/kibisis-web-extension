import {
  Avatar,
  Button,
  Heading,
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
import { IoChevronForward } from 'react-icons/io5';

// Hooks
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAssetsByGenesisHash,
  useSelectFetchingAssets,
  useSelectUpdatingAssets,
} from '@extension/selectors';

// Types
import { IAccount, IAsset } from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@extension/utils';

interface IProps {
  account: IAccount;
}

const AccountAssetsTab: FC<IProps> = ({ account }: IProps) => {
  const { t } = useTranslation();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(account.genesisHash);
  const fetching: boolean = useSelectFetchingAssets();
  const updating: boolean = useSelectUpdatingAssets();
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const renderContent = () => {
    if (fetching || updating) {
      return Array.from({ length: 3 }, () => (
        <Button
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          borderRadius={0}
          fontSize="md"
          h={16}
          justifyContent="start"
          key={nanoid()}
          p={0}
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

    if (account.assets.length <= 0) {
      return (
        <>
          <Spacer />
          <VStack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            w="full"
          >
            <Heading color={defaultTextColor} size="md" textAlign="center">
              {t<string>('headings.noAssetsFound')}
            </Heading>
          </VStack>
          <Spacer />
        </>
      );
    }

    return account.assets.reduce<ReactNode>((acc, assetHolding) => {
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
            borderRadius={0}
            fontSize="md"
            h={16}
            justifyContent="start"
            p={0}
            rightIcon={
              <Icon
                as={IoChevronForward}
                color={defaultTextColor}
                h={6}
                w={6}
              />
            }
            variant="ghost"
            w="full"
          >
            <HStack alignItems="center" m={0} p={0} pl={2} spacing={2} w="full">
              {/* Icon */}
              <Avatar
                bg="blue.500"
                name={asset.unitName || asset.id}
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
  };

  return (
    <TabPanel
      flexGrow={1}
      m={0}
      p={0}
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
