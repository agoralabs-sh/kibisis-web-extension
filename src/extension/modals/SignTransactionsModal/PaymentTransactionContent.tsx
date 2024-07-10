import { Heading, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { encodeAddress } from 'algosdk';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import ChainBadge from '@extension/components/ChainBadge';
import ModalAssetItem from '@extension/components/ModalAssetItem';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ITransactionBodyProps } from './types';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import parseTransactionType from '@extension/utils/parseTransactionType';

const PaymentTransactionContent: FC<ITransactionBodyProps> = ({
  accounts,
  condensed,
  fromAccount,
  hideNetwork = false,
  loading = false,
  network,
  transaction,
}) => {
  const { t } = useTranslation();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const subTextColor = useSubTextColor();
  // misc
  const accountInformation = fromAccount
    ? AccountService.extractAccountInformationForNetwork(fromAccount, network)
    : null;
  const amountAsAtomicUnit = new BigNumber(
    transaction.amount ? String(transaction.amount) : '0'
  );
  const amountInStandardUnits = convertToStandardUnit(
    amountAsAtomicUnit,
    network.nativeCurrency.decimals
  );
  const feeInAtomicUnits = new BigNumber(
    transaction.fee ? String(transaction.fee) : '0'
  );
  const icon = createIconFromDataUri(network.nativeCurrency.iconUrl, {
    color: subTextColor,
    h: 3,
    w: 3,
  });
  const transactionType = parseTransactionType(
    transaction.get_obj_for_encoding(),
    {
      network,
      sender: fromAccount,
    }
  );
  // renders
  const renderExtraInformation = () => (
    <>
      {/*fee*/}
      <ModalAssetItem
        amountInAtomicUnits={feeInAtomicUnits}
        decimals={network.nativeCurrency.decimals}
        icon={icon}
        label={`${t<string>('labels.fee')}:`}
        unit={network.nativeCurrency.symbol}
      />

      {/*balance*/}
      <ModalAssetItem
        amountInAtomicUnits={
          new BigNumber(accountInformation?.atomicBalance || '0')
        }
        decimals={network.nativeCurrency.decimals}
        icon={icon}
        isLoading={loading}
        label={`${t<string>('labels.balance')}:`}
        unit={network.nativeCurrency.symbol}
      />

      {/*network*/}
      {!hideNetwork && (
        <ModalItem
          label={`${t<string>('labels.network')}:`}
          value={<ChainBadge network={network} size="sm" />}
        />
      )}

      {/*note*/}
      {transaction.note && transaction.note.length > 0 && (
        <ModalTextItem
          isCode={true}
          label={`${t<string>('labels.note')}:`}
          value={new TextDecoder().decode(transaction.note)}
        />
      )}
    </>
  );

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      {condensed ? (
        <>
          {/*heading*/}
          <Text
            color={defaultTextColor}
            fontSize="md"
            textAlign="left"
            w="full"
          >
            {t<string>('headings.transaction', {
              context: transactionType,
            })}
          </Text>

          {/*amount*/}
          <ModalAssetItem
            amountInAtomicUnits={amountAsAtomicUnit}
            decimals={network.nativeCurrency.decimals}
            icon={icon}
            label={`${t<string>('labels.amount')}:`}
            unit={network.nativeCurrency.symbol}
          />
        </>
      ) : (
        <>
          {/*amount*/}
          <Tooltip
            aria-label="Amount with unrestricted decimals"
            label={`${amountInStandardUnits.toString()} ${
              network.nativeCurrency.symbol
            }`}
          >
            <HStack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              w="full"
            >
              <Heading color={defaultTextColor} size="lg" textAlign="center">
                {formatCurrencyUnit(amountInStandardUnits, {
                  decimals: network.nativeCurrency.decimals,
                })}
              </Heading>

              {icon}

              <Text color={defaultTextColor} fontSize="sm" textAlign="center">
                {network.nativeCurrency.symbol}
              </Text>
            </HStack>
          </Tooltip>

          {/*heading*/}
          <Text
            color={defaultTextColor}
            fontSize="md"
            textAlign="left"
            w="full"
          >
            {t<string>('headings.transaction', {
              context: transactionType,
            })}
          </Text>
        </>
      )}

      {/*from*/}
      <ModalItem
        flexGrow={1}
        label={`${t<string>('labels.from')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={encodeAddress(transaction.from.publicKey)}
            ariaLabel="From address"
            size="sm"
            network={network}
          />
        }
      />

      {/*to*/}
      <ModalItem
        flexGrow={1}
        label={`${t<string>('labels.to')}:`}
        value={
          <AddressDisplay
            accounts={accounts}
            address={encodeAddress(transaction.to.publicKey)}
            ariaLabel="To address"
            size="sm"
            network={network}
          />
        }
      />

      {condensed ? (
        <MoreInformationAccordion
          color={defaultTextColor}
          fontSize="xs"
          isOpen={condensed.expanded}
          onChange={condensed.onChange}
        >
          <VStack spacing={DEFAULT_GAP / 3} w="full">
            {renderExtraInformation()}
          </VStack>
        </MoreInformationAccordion>
      ) : (
        renderExtraInformation()
      )}
    </VStack>
  );
};

export default PaymentTransactionContent;
