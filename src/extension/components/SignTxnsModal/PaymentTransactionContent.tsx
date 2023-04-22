import {
  Code,
  Heading,
  HStack,
  Icon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Algodv2, encodeAddress, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWalletOutline } from 'react-icons/io5';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';
import useTextBackgroundColor from '@extension/hooks/useTextBackgroundColor';

// Features
import { fetchAccountInformationWithDelay } from '@extension/features/accounts';

// Selectors
import { useSelectAccounts } from '@extension/selectors';

// Theme
import { theme } from '@extension/theme';

// Types
import {
  IAccount,
  IAlgorandAccountInformation,
  INativeCurrency,
  INetwork,
  INode,
} from '@extension/types';

// Utils
import { convertToStandardUnit, formatCurrencyUnit } from '@common/utils';
import {
  createIconFromDataUri,
  ellipseAddress,
  randomNode,
} from '@extension/utils';

interface IProps {
  nativeCurrency: INativeCurrency;
  network: INetwork;
  transaction: Transaction;
}

const PaymentTransactionContent: FC<IProps> = ({
  nativeCurrency,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  const textBackgroundColor: string = useTextBackgroundColor();
  const accounts: IAccount[] = useSelectAccounts();
  const [fromBalance, setFromBalance] = useState<BigNumber>(new BigNumber('0'));
  const decoder: TextDecoder = new TextDecoder();
  const fromAccount: IAccount | null =
    accounts.find(
      (value) => value.address === encodeAddress(transaction.from.publicKey)
    ) || null;
  const toAccount: IAccount | null =
    accounts.find(
      (value) => value.address === encodeAddress(transaction.to.publicKey)
    ) || null;
  const standardUnitAmount: BigNumber = convertToStandardUnit(
    new BigNumber(String(transaction.amount) || '0'),
    nativeCurrency.decimals
  );

  useEffect(() => {
    (async () => {
      const node: INode = randomNode(network);
      const accountInformation: IAlgorandAccountInformation =
        await fetchAccountInformationWithDelay({
          address: encodeAddress(transaction.from.publicKey),
          delay: 0,
          client: new Algodv2('', node.url, node.port),
        });

      if (accountInformation) {
        setFromBalance(new BigNumber(String(accountInformation.amount)));
      }
    })();
  }, []);

  return (
    <VStack spacing={4} w="full">
      {/* Amount */}
      <Tooltip
        aria-label="Asset amount with unrestricted decimals"
        label={`${standardUnitAmount.toString()} ${nativeCurrency.code}`}
      >
        <HStack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          w="full"
        >
          <Heading color={defaultTextColor} size="lg" textAlign="center">
            {formatCurrencyUnit(standardUnitAmount)}
          </Heading>
          {createIconFromDataUri(nativeCurrency.iconUri, {
            color: defaultTextColor,
            h: 3,
            w: 3,
          })}
          <Text color={defaultTextColor} fontSize="sm" textAlign="center">
            {nativeCurrency.code}
          </Text>
        </HStack>
      </Tooltip>

      {/* From */}
      <HStack justifyContent="space-between" spacing={2} w="full">
        <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
          'labels.from'
        )}:`}</Text>
        <Tooltip
          aria-label="From address"
          label={encodeAddress(transaction.from.publicKey)}
        >
          {fromAccount ? (
            <HStack
              backgroundColor={textBackgroundColor}
              borderRadius={theme.radii['3xl']}
              px={2}
              py={1}
              spacing={1}
            >
              <Icon as={IoWalletOutline} color={subTextColor} h={2} w={2} />
              <Text color={subTextColor} fontSize="xs">
                {fromAccount.name ||
                  ellipseAddress(fromAccount.address, {
                    end: 10,
                    start: 10,
                  })}
              </Text>
            </HStack>
          ) : (
            <Text color={subTextColor} fontSize="xs">
              {ellipseAddress(encodeAddress(transaction.from.publicKey), {
                end: 10,
                start: 10,
              })}
            </Text>
          )}
        </Tooltip>
      </HStack>

      {/* To */}
      <HStack justifyContent="space-between" spacing={2} w="full">
        <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
          'labels.to'
        )}:`}</Text>
        <Tooltip
          aria-label="To address"
          label={encodeAddress(transaction.to.publicKey)}
        >
          {toAccount ? (
            <HStack
              backgroundColor={textBackgroundColor}
              borderRadius={theme.radii['3xl']}
              px={2}
              py={1}
              spacing={1}
            >
              <Icon as={IoWalletOutline} color={subTextColor} h={2} w={2} />
              <Text color={subTextColor} fontSize="xs">
                {toAccount.name ||
                  ellipseAddress(toAccount.address, {
                    end: 10,
                    start: 10,
                  })}
              </Text>
            </HStack>
          ) : (
            <Text color={subTextColor} fontSize="xs">
              {ellipseAddress(encodeAddress(transaction.to.publicKey), {
                end: 10,
                start: 10,
              })}
            </Text>
          )}
        </Tooltip>
      </HStack>

      {/* Balance */}
      <HStack justifyContent="space-between" spacing={2} w="full">
        <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
          'labels.balance'
        )}:`}</Text>
        <Tooltip
          aria-label="Balance with unrestricted decimals"
          label={`${convertToStandardUnit(
            fromBalance,
            nativeCurrency.decimals
          ).toString()} ${nativeCurrency.code}`}
        >
          <HStack spacing={1}>
            <Text color={subTextColor} fontSize="xs">
              {formatCurrencyUnit(
                convertToStandardUnit(fromBalance, nativeCurrency.decimals)
              )}
            </Text>
            {createIconFromDataUri(nativeCurrency.iconUri, {
              color: subTextColor,
              h: 3,
              w: 3,
            })}
          </HStack>
        </Tooltip>
      </HStack>

      {/* Fee */}
      <HStack justifyContent="space-between" spacing={2} w="full">
        <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
          'labels.fee'
        )}:`}</Text>
        <HStack spacing={1}>
          <Text color={subTextColor} fontSize="xs">
            {formatCurrencyUnit(
              convertToStandardUnit(
                new BigNumber(String(transaction.fee)),
                nativeCurrency.decimals
              )
            )}
          </Text>
          {createIconFromDataUri(nativeCurrency.iconUri, {
            color: subTextColor,
            h: 2,
            w: 2,
          })}
        </HStack>
      </HStack>

      {/* Note */}
      {transaction.note && (
        <HStack justifyContent="space-between" spacing={2} w="full">
          <Text color={defaultTextColor} fontSize="xs">{`${t<string>(
            'labels.note'
          )}:`}</Text>
          <HStack spacing={1}>
            <Code borderRadius="md" fontSize="xs" wordBreak="break-word">
              {decoder.decode(transaction.note)}
            </Code>
          </HStack>
        </HStack>
      )}
    </VStack>
  );
};

export default PaymentTransactionContent;
