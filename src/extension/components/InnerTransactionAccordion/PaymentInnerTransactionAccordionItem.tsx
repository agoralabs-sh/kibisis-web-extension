import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Code,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageItem from '@extension/components/PageItem';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

// selectors
import { useSelectSettingsPreferredBlockExplorer } from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IBlockExplorer, IPaymentTransaction } from '@extension/types';
import type { IItemProps } from './types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import isAccountKnown from '@extension/utils/isAccountKnown';

const PaymentInnerTransactionAccordionItem: FC<
  IItemProps<IPaymentTransaction>
> = ({
  account,
  accounts,
  color,
  fontSize,
  minButtonHeight,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  // selectors
  const preferredExplorer: IBlockExplorer | null =
    useSelectSettingsPreferredBlockExplorer();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
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
          <AssetDisplay
            atomicUnitAmount={amount}
            amountColor={
              amount.lte(0)
                ? color || defaultTextColor
                : transaction.receiver === accountAddress
                ? 'green.500'
                : 'red.500'
            }
            decimals={network.nativeCurrency.decimals}
            fontSize={fontSize}
            icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
              color: color || defaultTextColor,
              h: 3,
              w: 3,
            })}
            prefix={
              amount.lte(0)
                ? undefined
                : transaction.receiver === accountAddress
                ? '+'
                : '-'
            }
            unit={network.nativeCurrency.symbol}
          />
        </HStack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={0} pt={2} px={0}>
        <VStack spacing={2} w="full">
          {/*from*/}
          <PageItem fontSize="xs" label={t<string>('labels.from')}>
            <HStack spacing={0}>
              <AddressDisplay
                accounts={accounts}
                address={transaction.sender}
                ariaLabel="From address"
                size="xs"
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
                accounts={accounts}
                address={transaction.receiver}
                ariaLabel="From address"
                size="xs"
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

export default PaymentInnerTransactionAccordionItem;
