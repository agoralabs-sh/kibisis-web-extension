import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Code,
  HStack,
  ResponsiveValue,
  Text,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import * as CSS from 'csstype';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageItem from '@extension/components/PageItem';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// Services
import { AccountService } from '@extension/services';

// Types
import {
  IAccount,
  IExplorer,
  INetwork,
  IPaymentTransaction,
} from '@extension/types';

// Utils
import { createIconFromDataUri } from '@extension/utils';

interface IProps {
  account: IAccount;
  color?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  minButtonHeight?: ResponsiveValue<number | CSS.Property.MinHeight>;
  network: INetwork;
  transaction: IPaymentTransaction;
}

const PaymentInnerTransactionAccordionItem: FC<IProps> = ({
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
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const accountAddress: string =
    AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
  const amount: BigNumber = new BigNumber(String(transaction.amount));
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const isReceiverKnown: boolean =
    accounts.findIndex(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        transaction.receiver
    ) > -1;
  const isSenderKnown: boolean =
    accounts.findIndex(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        transaction.sender
    ) > -1;

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
            icon={createIconFromDataUri(network.nativeCurrency.iconUri, {
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
            unit={network.nativeCurrency.code}
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
                address={transaction.sender}
                ariaLabel="From address"
                color={subTextColor}
                fontSize="xs"
                network={network}
              />

              {/*open in explorer button*/}
              {!isSenderKnown && explorer && (
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
              {!isReceiverKnown && explorer && (
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
