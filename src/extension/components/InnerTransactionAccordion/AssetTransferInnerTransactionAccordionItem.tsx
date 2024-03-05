import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Code,
  HStack,
  ResponsiveValue,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import * as CSS from 'csstype';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';
import CopyIconButton from '@extension/components/CopyIconButton';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageItem from '@extension/components/PageItem';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useStandardAssetById from '@extension/hooks/useStandardAssetById';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import {
  IAccount,
  IAssetTransferTransaction,
  IBlockExplorer,
  INetwork,
} from '@extension/types';

// utils
import isAccountKnown from '@extension/utils/isAccountKnown';

interface IProps {
  account: IAccount;
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  network: INetwork;
  transaction: IAssetTransferTransaction;
}

const AssetTransferInnerTransactionAccordionItem: FC<IProps> = ({
  account,
  color,
  fontSize,
  minButtonHeight,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const preferredExplorer: IBlockExplorer | null =
    useSelectPreferredBlockExplorer();
  // hooks
  const { standardAsset, updating } = useStandardAssetById(transaction.assetId);
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const accountAddress: string =
    AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
  const amount: BigNumber = new BigNumber(String(transaction.amount));
  const explorer: IBlockExplorer | null =
    network.blockExplorers.find(
      (value) => value.id === preferredExplorer?.id
    ) ||
    network.blockExplorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one

  return (
    <AccordionItem border="none" px={3} py={2} w="full">
      <AccordionButton minH={minButtonHeight} p={0}>
        <HStack
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          w="full"
        >
          {/*type*/}
          <Text color={color || defaultTextColor} fontSize={fontSize}>
            {t<string>('headings.transaction', { context: transaction.type })}
          </Text>

          {/*amount*/}
          {!standardAsset || updating ? (
            <Skeleton>
              <Text color={defaultTextColor} fontSize={fontSize}>
                0.001
              </Text>
            </Skeleton>
          ) : (
            <AssetDisplay
              amountColor={
                amount.lte(0)
                  ? color || defaultTextColor
                  : transaction.receiver === accountAddress
                  ? 'green.500'
                  : 'red.500'
              }
              atomicUnitAmount={amount}
              decimals={standardAsset.decimals}
              displayUnit={true}
              displayUnitColor={color || defaultTextColor}
              fontSize={fontSize}
              prefix={
                amount.lte(0)
                  ? undefined
                  : transaction.receiver === accountAddress
                  ? '+'
                  : '-'
              }
              unit={standardAsset.unitName || undefined}
            />
          )}
        </HStack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={0} pt={2} px={0}>
        <VStack spacing={2} w="full">
          {/*asset id*/}
          <PageItem fontSize="xs" label={t<string>('labels.assetId')}>
            {!standardAsset || updating ? (
              <Skeleton>
                <Text color={subTextColor} fontSize="xs">
                  12345678
                </Text>
              </Skeleton>
            ) : (
              <HStack spacing={0}>
                <Text color={subTextColor} fontSize="xs">
                  {standardAsset.id}
                </Text>
                <CopyIconButton
                  ariaLabel={t<string>('labels.copyAssetId')}
                  tooltipLabel={t<string>('labels.copyAssetId')}
                  size="xs"
                  value={standardAsset.id}
                />
                {explorer && (
                  <OpenTabIconButton
                    size="xs"
                    tooltipLabel={t<string>('captions.openOn', {
                      name: explorer.canonicalName,
                    })}
                    url={`${explorer.baseUrl}${explorer.assetPath}/${standardAsset.id}`}
                  />
                )}
              </HStack>
            )}
          </PageItem>

          {/*from*/}
          <PageItem fontSize="xs" label={t<string>('labels.from')}>
            <HStack spacing={0}>
              <AddressDisplay
                address={transaction.sender}
                ariaLabel="From address"
                color={subTextColor}
                fontSize="xs"
                network={network}
              />

              {/*open in explorer button*/}
              {!isAccountKnown(accounts, transaction.sender) && explorer && (
                <OpenTabIconButton
                  size="xs"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.sender}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*to*/}
          <PageItem fontSize="xs" label={t<string>('labels.to')}>
            <HStack spacing={0}>
              <AddressDisplay
                address={transaction.receiver}
                ariaLabel="From address"
                color={subTextColor}
                fontSize="xs"
                network={network}
              />

              {/*open in explorer button*/}
              {!isAccountKnown(accounts, transaction.receiver) && explorer && (
                <OpenTabIconButton
                  size="xs"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.receiver}`}
                />
              )}
            </HStack>
          </PageItem>

          {/*note*/}
          {transaction.note && (
            <PageItem fontSize="xs" label={t<string>('labels.note')}>
              <Code
                borderRadius="md"
                color={defaultTextColor}
                fontSize="xs"
                wordBreak="break-word"
              >
                {transaction.note}
              </Code>
            </PageItem>
          )}
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AssetTransferInnerTransactionAccordionItem;
